import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
   //current logged in user
  final User? currentUser = FirebaseAuth.instance.currentUser;

  //future to fetch user details
  Future<DocumentSnapshot<Map<String, dynamic>>> getUserDetails() async{
    return await FirebaseFirestore
    .instance
    .collection("Users")
    .doc(currentUser!.email)
    .get();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("P R O F I L E",
              style: TextStyle(
                color: Theme.of(context).colorScheme.inversePrimary,
                fontWeight: FontWeight.w600,
              ),
              ),
        backgroundColor: Theme.of(context).colorScheme.primary,
        elevation: 10,
        
      ),
      body: FutureBuilder<DocumentSnapshot<Map<String, dynamic>>> (
        future: getUserDetails(),
        builder: (context,snapshot) {
          //loading
          if(snapshot.connectionState == ConnectionState.waiting){
            return const Center(child: CircularProgressIndicator(),);
          }
          //error if any
          else if(snapshot.hasError){
            return Text("Error: ${snapshot.error}");
          }
          //data recieved
          else if(snapshot.hasData){
            Map<String, dynamic>? user = snapshot.data!.data();

            return Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                children: [
                   Container(
                    decoration: BoxDecoration(
                     
                      color: Theme.of(context).colorScheme.primary,
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Icon(Icons.person,
                        size: 90,
                        color: Theme.of(context).colorScheme.inversePrimary,
                      ),
                    ),
                   ),
              const SizedBox(height: 50,),

                   Padding(
                     padding: const EdgeInsets.all(10.0),
                     child: Row(
                       children: [
                         Text("W E L C O M E !",
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.w600,
                              ),
                              ),
                       ],
                     ),
                   ),
              const SizedBox(height: 20,),

                  Container(
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.primary,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Row(
                        children: [
                      
                          Text("USER:  ",
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                          ),
                          ),
                                        
                          Text(user?['username'],
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                          ),
                          ),
                          
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 25,),

                  Container(
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.primary,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Row(
                        children: [
                          Text("EMAIL:  ",
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                          ),
                          ),
                                        
                          Text(user!['email'],
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                          ),
                          ),
                          
                        ],
                      ),
                    ),
                  ),
                
                ],
              ),
            );
          }
          else{
            return Text("No Data");
          }

        }
        ),
    );
  }
}