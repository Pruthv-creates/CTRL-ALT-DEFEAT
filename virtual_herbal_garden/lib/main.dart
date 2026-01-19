import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:virtual_herbal_garden/auth/auth.dart';
import 'package:virtual_herbal_garden/auth/login_or_register.dart';
import 'package:virtual_herbal_garden/firebase_options.dart';
import 'package:virtual_herbal_garden/models/plant.dart';
import 'package:virtual_herbal_garden/pages/home_page.dart';
import 'package:virtual_herbal_garden/pages/profile_page.dart';
import 'package:virtual_herbal_garden/theme/dark_mode.dart';
import 'package:virtual_herbal_garden/theme/light_mode.dart';
import 'package:virtual_herbal_garden/pages/explore_plants.dart';
import 'package:virtual_herbal_garden/pages/guided_tour_page.dart';
import 'package:virtual_herbal_garden/pages/tour_detail_page.dart';
import 'package:virtual_herbal_garden/pages/plant_details_page.dart';

void main() async{
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: AuthPage(),
      theme: lightMode,
      darkTheme: darkMode,
      routes: {
        '/login_or_register':(context) => const LoginOrRegister(),
        '/home_page':(context) => const HomePage(),
        '/profile_page':(context) =>const ProfilePage(),
        '/explore_plants':(context) => const ExplorePlantsPage(),
        '/guided_tours': (context) => const GuidedToursPage(),
        '/guided_tour_detail': (context) => const GuidedTourDetailPage(),
        

      },
    );
  }
}