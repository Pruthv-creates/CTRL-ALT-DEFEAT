import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:virtual_herbal_garden/components/my_buttons.dart';
import 'package:virtual_herbal_garden/components/my_textfield.dart';
import 'package:virtual_herbal_garden/helper/helper_functions.dart';

class LoginPage extends StatefulWidget {

  final VoidCallback onTap;

  const LoginPage({
    super.key,
    required this.onTap,
    });

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
   //controlers
  final TextEditingController emailController = TextEditingController();

  final TextEditingController passwordController = TextEditingController();

  //userlogin
  void userlogin() async{
    //show loading
    showDialog(context: context, builder: (context)=> const Center(
      child: CircularProgressIndicator(),
        ),
      );

      //try sign in 

      try {
        await FirebaseAuth.instance.signInWithEmailAndPassword(
          email: emailController.text, 
          password: passwordController.text,
          );

          if(context.mounted){
             Navigator.pop(context);
          }
         
      } on FirebaseAuthException catch (e) {
        
        if(context.mounted){
             Navigator.pop(context);
          }

        displayMessagetoUser(e.code, context);
      }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(25.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              
              //logo
              Icon(Icons.person,
              size: 80,
              color: Theme.of(context).colorScheme.inversePrimary,
              ),
          
              const SizedBox(height: 25,),
              //name
              Text("Virtual Herbal Garden",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
              ),
              ),
          
              const SizedBox(height: 50,),
              
              //email
              MyTextfield(
                hintText: "Email", 
                obscureText: false, 
                controller: emailController
                ),

               const SizedBox(height: 20,),

              //password
              MyTextfield(
                hintText: "Password", 
                obscureText: true, 
                controller: passwordController
                ),

              const SizedBox(height: 10,),

              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Text("Forgot password?",
                  style: TextStyle(
                    fontWeight: FontWeight.w700,
                  ),
                  ),
                ],
              ),
              
              const SizedBox(height: 25,),
              //sign in

              MyButtons(
                text: "Login", 
                onTap: userlogin,
                ),

                //no account

                const SizedBox(height: 15,),

                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Text("Don't have an account? "),
                    
                    GestureDetector(
                      onTap: widget.onTap,
                      child: Text(" Register here",
                      style: TextStyle(
                        fontWeight: FontWeight.w700,
                      ),
                      ),
                    ),
                  ],
                ),
            ],
          ),
        ),
      ),

    );
  }
}