import 'package:MessagesApp/expanded/bloc/todo_bloc.dart';
import 'package:MessagesApp/expanded/event/add_todo_event.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class TodoHeader extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var txtTodoController = TextEditingController();
    var bloc = Provider.of<TodoBloc>(context);
    return Row(
      children: <Widget>[
        Expanded(
          child: TextFormField(
            controller: txtTodoController,
            decoration:
                InputDecoration(labelText: 'Add todo', hintText: 'Add todo'),
          ),
        ),
        SizedBox(
          width: 20,
        ),
        RaisedButton.icon(
            onPressed: () {
              if (txtTodoController.text.trim() != '' &&
                  txtTodoController.text.trim() != null) {
                bloc.event.add(AddTodoEvent(txtTodoController.text));
                txtTodoController.text = '';
              }
            },
            icon: Icon(Icons.add),
            label: Text('Add'))
      ],
    );
  }
}
