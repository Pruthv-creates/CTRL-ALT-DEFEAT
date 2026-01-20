import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class BookmarkService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  Stream<List<String>> bookmarkIdsStream() {
    final uid = FirebaseAuth.instance.currentUser!.uid;

    return _firestore.collection('Users').doc(uid).snapshots().map((snap) {
      final data = snap.data();
      if (data == null) return [];
      return List<String>.from(data['bookmarks'] ?? []);
    });
  }

  Future<void> toggleBookmark(String plantId, bool isBookmarked) async {
    final uid = FirebaseAuth.instance.currentUser!.uid;
    final doc = _firestore.collection('Users').doc(uid);

    if (isBookmarked) {
      await doc.update({
        'bookmarks': FieldValue.arrayRemove([plantId]),
      });
    } else {
      await doc.update({
        'bookmarks': FieldValue.arrayUnion([plantId]),
      });
    }
  }
}
