import 'package:flutter/material.dart';
import 'models/cart.dart';
import 'models/user_model.dart';
import 'models/chat_model.dart';
import 'models/review_model.dart';
import 'models/notification_model.dart';
import 'theme/app_theme.dart';
import 'screens/welcome_screen.dart';

void main() {
  runApp(
    CartNotifier(
      model: CartModel(),
      child: UserNotifier(
        model: UserModel(),
        child: ChatNotifier(
          model: ChatModel(),
          child: ReviewNotifier(
            model: ReviewModel(),
            child: NotificationNotifier(
              model: NotificationModel(),
              child: const AgriFairApp(),
            ),
          ),
        ),
      ),
    ),
  );
}

class AgriFairApp extends StatelessWidget {
  const AgriFairApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AgriFair',
      debugShowCheckedModeBanner: false,
      theme: buildAppTheme(),
      home: const WelcomeScreen(),
    );
  }
}
