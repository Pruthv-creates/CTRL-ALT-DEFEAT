import 'package:flutter/material.dart';
import 'package:virtual_herbal_garden/helper/helper_functions.dart';
//import 'package:socialmedia_app/pages/profile_page.dart';

class MyDrawer extends StatelessWidget {
  const MyDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: Theme.of(context).colorScheme.secondary,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          //drawer header
          Column(
            children: [
              DrawerHeader(
            child: Icon(Icons.favorite,
              color: Theme.of(context).colorScheme.inversePrimary,
            ),
            ),

            const SizedBox(height: 20,),
          //home tile
          Padding(
            padding: const EdgeInsets.only(left: 20.0),
            child: ListTile(
              leading: Icon(Icons.home,
                color: Theme.of(context).colorScheme.inversePrimary,
              ),
              title: Text("Vir t u a l   G a r d e n",
              style: TextStyle(
                color: Theme.of(context).colorScheme.inversePrimary,
                fontWeight: FontWeight.w600,
              ),
              ),
              onTap: () {
                //aready on home so just pop
                Navigator.pop(context);
              },
            ),
          ),
          //profile tile
           Padding(
            padding: const EdgeInsets.only(left: 20.0),
            child: ListTile(
              leading: Icon(Icons.person,
                color: Theme.of(context).colorScheme.inversePrimary,
              ),
              title: Text("P R O F I L E",
              style: TextStyle(
                color: Theme.of(context).colorScheme.inversePrimary,
                fontWeight: FontWeight.w600,
              ),
              ),
              onTap: () {
                //pop the drawer
                Navigator.pop(context);
                //go to profile_page

                Navigator.pushNamed(context, '/profile_page');
          
              },
            ),
          ),
          //users tile
           Padding(
            padding: const EdgeInsets.only(left: 20.0),
            child: ListTile(
              leading: Icon(Icons.group,
                color: Theme.of(context).colorScheme.inversePrimary,
              ),
              title: Text("Explore Plants",
              style: TextStyle(
                color: Theme.of(context).colorScheme.inversePrimary,
                fontWeight: FontWeight.w600,
              ),
              ),
              onTap: () {
                //pop the drawer
                Navigator.pop(context);
                //go to profile_page

                Navigator.pushNamed(context, '/explore_plants');
              },
            ),
          ),
            ],
          ),
          Padding(
                      padding: const EdgeInsets.only(left: 20.0,bottom: 35.0),
                      child: ListTile(
                        leading: Icon(Icons.logout,
                          color: Theme.of(context).colorScheme.inversePrimary,
                        ),
                        title: Text("L O G O U T",
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.inversePrimary,
                          fontWeight: FontWeight.w600,
                        ),
                        ),
                        //logout
                        onTap: logout,
                      ),
                    ),
        ],
      ),
      
      );
      
  }
}