import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class BookmarkService {
  final _db = FirebaseFirestore.instance;
  final _auth = FirebaseAuth.instance;

  Future<void> bookmarkPlant(String plantId) async {
    final uid = _auth.currentUser!.uid;

    await _db
        .collection('bookmarks')
        .doc(uid)
        .collection('plants')
        .doc(plantId)
        .set({
      'plantId': plantId,
      'bookmarkedAt': Timestamp.now(),
    });
  }
}
