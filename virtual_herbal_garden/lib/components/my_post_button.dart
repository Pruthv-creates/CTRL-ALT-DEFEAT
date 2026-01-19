import 'package:flutter/material.dart';

class MyPostButton extends StatelessWidget {

  final VoidCallback? onTap;

  const MyPostButton({super.key, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Theme.of(context).colorScheme.inversePrimary)
        ),
        child: Padding(
          padding: const EdgeInsets.all(14.0),
          child: Center(child: Icon(Icons.done),),
        ),
      ),
    );
  }
}