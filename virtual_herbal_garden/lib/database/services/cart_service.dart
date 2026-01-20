import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class CartService {
  final _firestore = FirebaseFirestore.instance;
  final _auth = FirebaseAuth.instance;

  /// Get current user ID safely
  String get _uid {
    final user = _auth.currentUser;
    if (user == null) {
      throw Exception("User not logged in");
    }
    return user.uid;
  }

  /// Stream of plant IDs in cart
  Stream<List<String>> cartPlantIdsStream() {
    return _firestore
        .collection('Users')
        .doc(_uid)
        .snapshots()
        .map((doc) {
      final data = doc.data();
      if (data == null || data['cart'] == null) {
        return <String>[];
      }
      return List<String>.from(data['cart']);
    });
  }

  ///  Add plant to cart
  Future<void> addToCart(String plantId) async {
    await _firestore.collection('Users').doc(_uid).set({
      'cart': FieldValue.arrayUnion([plantId]),
    }, SetOptions(merge: true));
  }

  /// ➖ Remove plant from cart
  Future<void> removeFromCart(String plantId) async {
    await _firestore.collection('Users').doc(_uid).set({
      'cart': FieldValue.arrayRemove([plantId]),
    }, SetOptions(merge: true));
  }

  ///  Clear cart (useful after order)
  Future<void> clearCart() async {
    await _firestore.collection('Users').doc(_uid).update({
      'cart': [],
    });
  }
}
