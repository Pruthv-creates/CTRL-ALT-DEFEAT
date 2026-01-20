import 'package:flutter/material.dart';

ThemeData darkMode = ThemeData(
  useMaterial3: true,
  brightness: Brightness.dark,

 
  scaffoldBackgroundColor: const Color(0xFF0E1A14),

  colorScheme: const ColorScheme.dark(
    /// Base surfaces
    surface: Color(0xFF1A2A22),
    surfaceContainerHighest: Color(0xFF0E1A14),

    /// Primary 
    primary: Color(0xFF6FCF97),
    primaryContainer: Color(0xFF2E5A43),

    /// Secondary 
    secondary: Color(0xFFD6C27A),
    secondaryContainer: Color.fromARGB(255, 157, 144, 102),

    /// Accent / contrast
    inversePrimary: Color(0xFFEAF7EE),

    /// Text colors
    onPrimary: Color(0xFF0F1411),
    onSecondary: Color(0xFF1C1C1C),
    onSurface: Color(0xFFE5EEE9),
   
  ),

  
  textTheme: ThemeData.dark().textTheme.copyWith(
        titleLarge: const TextStyle(
          fontSize: 22,
          fontWeight: FontWeight.bold,
          color: Color(0xFFEAF7EE),
        ),
        titleMedium: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: Color(0xFFDDEBE2),
        ),
        bodyLarge: const TextStyle(
          fontSize: 16,
          color: Color(0xFFE5EEE9),
        ),
        bodyMedium: const TextStyle(
          fontSize: 14,
          color: Color(0xFFD5E2DA),
        ),
        bodySmall: const TextStyle(
          fontSize: 12,
          color: Color(0xFF9FB6AA),
        ),
      ),

 
  appBarTheme: const AppBarTheme(
    backgroundColor: Color(0xFF1A2A22),
    foregroundColor: Color(0xFFEAF7EE),
    elevation: 4,
    centerTitle: true,
  ),

  
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      backgroundColor: const Color(0xFF6FCF97),
      foregroundColor: const Color(0xFF0F1411),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14),
      ),
      padding: const EdgeInsets.symmetric(
        horizontal: 20,
        vertical: 14,
      ),
    ),
  ),

  
  cardTheme: CardThemeData(
    color: const Color(0xFF24382F),
    elevation: 6,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(16),
    ),
  ),

  
  chipTheme: ChipThemeData(
    backgroundColor: const Color(0xFF2E5A43),
    selectedColor: const Color(0xFF6FCF97),
    labelStyle: const TextStyle(color: Color(0xFFEAF7EE)),
    secondaryLabelStyle: const TextStyle(color: Color(0xFF0F1411)),
    padding: const EdgeInsets.symmetric(horizontal: 10),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12),
    ),
  ),

 
  inputDecorationTheme: InputDecorationTheme(
    filled: true,
    fillColor: const Color(0xFF24382F),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(14),
      borderSide: BorderSide.none,
    ),
  ),

  
  listTileTheme: const ListTileThemeData(
    iconColor: Color(0xFFEAF7EE),
    textColor: Color(0xFFEAF7EE),
  ),

  iconTheme: const IconThemeData(
    color: Color(0xFFEAF7EE),
  ),

 
  dividerTheme: DividerThemeData(
    color: Colors.grey.shade700,
    thickness: 0.6,
  ),

 
  drawerTheme: const DrawerThemeData(
    backgroundColor: Color(0xFF121F19),
  ),
);
