import 'package:flutter/material.dart';

import 'core/constants/route_path_constants.dart';
import 'route.dart';

void main() async {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      onGenerateRoute: MainRouter.generateRoute,
      initialRoute: RoutePaths.Home,
    );
  }
}
