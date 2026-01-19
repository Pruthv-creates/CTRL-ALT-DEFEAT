import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:virtual_herbal_garden/components/my_buttons.dart';
import 'package:virtual_herbal_garden/components/my_textfield.dart';
import 'package:virtual_herbal_garden/helper/helper_functions.dart';

class RegisterPage extends StatefulWidget {

  final VoidCallback onTap;

  const RegisterPage({
    super.key,
    required this.onTap,
    });

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  //controlers
  final TextEditingController usernameController = TextEditingController();

  final TextEditingController emailController = TextEditingController();

  final TextEditingController passwordController = TextEditingController();

  final TextEditingController confirmpasswordController = TextEditingController();

  void userregister() async {
    //loading circle
    showDialog(
      context: context, 
      builder: (context) => const Center(
        child: CircularProgressIndicator(),
        ),
      );

    //regex and match passwords
    if(passwordController.text != confirmpasswordController.text){
      //pop loading circle
      Navigator.pop(context);

      //show error message
      displayMessagetoUser("Passwords don't match!",context);
    }
    else{
      //creating the user
    try{
      UserCredential? userCredential = await FirebaseAuth.instance.createUserWithEmailAndPassword(
        email: emailController.text, 
        password: passwordController.text,
        );

        //create user document and add to firestore
        createUserDocument(userCredential);

      //pop circle
      if (context.mounted) Navigator.pop(context);
    } on FirebaseAuthException catch (e) {
      Navigator.pop(context);

      displayMessagetoUser(e.code, context);
    }
    }
  }

  //create a user document and collect them in firestore
  Future<void> createUserDocument(UserCredential? userCredential) async {
    if(userCredential != null && userCredential.user != null){
      await FirebaseFirestore.
      instance
      .collection("Users")
      .doc(userCredential.user!.email)
      .set({
        'email': userCredential.user!.email,
        'username': usernameController.text,
      });
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
              
              //username
              MyTextfield(
                hintText: "Username", 
                obscureText: false, 
                controller: usernameController
                ),

               const SizedBox(height: 20,),

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

               //confirmpassword
              MyTextfield(
                hintText: "Confirm Password", 
                obscureText: true, 
                controller: confirmpasswordController
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
              
              //Register
              MyButtons(
                text: "Register", 
                onTap: userregister,
                ),

                //no account

                const SizedBox(height: 15,),

                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Text("Already have an account? "),
                    
                    GestureDetector(
                      onTap: widget.onTap,
                      child: Text(" Login here",
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