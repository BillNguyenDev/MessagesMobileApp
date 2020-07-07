import 'package:MessagesApp/expanded/todo/todo_header.dart';
import 'package:MessagesApp/expanded/todo/toto_list.dart';
import 'package:flutter/material.dart';

class TodoListContainer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(20),
      child: Column(
        children: <Widget>[TodoHeader(), Expanded(child: TodoList())],
      ),
    );
  }
}
