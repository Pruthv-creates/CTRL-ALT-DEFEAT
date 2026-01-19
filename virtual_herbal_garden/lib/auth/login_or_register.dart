import 'package:flutter/material.dart';
import 'package:virtual_herbal_garden/pages/login_page.dart';
import 'package:virtual_herbal_garden/pages/register_page.dart';


class LoginOrRegister extends StatefulWidget {
  const LoginOrRegister({super.key});

  @override
  State<LoginOrRegister> createState() => _LoginOrRegisterState();
}

class _LoginOrRegisterState extends State<LoginOrRegister> {
  
  //initailly show a login page
  bool showLoginPage = true;

  //toggle between
  void togglePages(){
    setState(() {
      showLoginPage = !showLoginPage;
    });
  }
  @override
  Widget build(BuildContext context) {
    if(showLoginPage){
      return LoginPage(onTap: togglePages);
    }
    else{
      return RegisterPage(onTap: togglePages);
    }
  }
}