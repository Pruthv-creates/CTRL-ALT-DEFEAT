import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class PlantIdentificationService {
  ///  Load API key from .env
  final String _apiKey = dotenv.env['PLANTNET_API_KEY'] ?? '';

  /// Identify plant from image
  Future<String?> identifyPlant(File imageFile) async {
    if (_apiKey.isEmpty) {
      throw Exception('PLANTNET_API_KEY not found in .env');
    }

    final uri = Uri.parse(
      'https://my-api.plantnet.org/v2/identify/all?api-key=$_apiKey',
    );

    final request = http.MultipartRequest('POST', uri);

    request.files.add(
      await http.MultipartFile.fromPath(
        'images',
        imageFile.path,
      ),
    );

    /// Optional but improves accuracy
    request.fields['organs'] = 'leaf';

    try {
      final streamedResponse = await request.send();

      if (streamedResponse.statusCode == 200) {
        final responseBody =
            await streamedResponse.stream.bytesToString();

        final data = json.decode(responseBody);

        if (data['results'] != null &&
            data['results'].isNotEmpty) {
          return data['results'][0]['species']
              ['scientificNameWithoutAuthor'];
        }
      } else {
        print(
          'PlantNet failed: ${streamedResponse.statusCode}',
        );
      }
    } catch (e) {
      print('PlantNet error: $e');
    }

    return null;
  }
}
