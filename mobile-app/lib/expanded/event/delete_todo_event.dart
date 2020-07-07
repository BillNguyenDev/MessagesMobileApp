import 'package:MessagesApp/expanded/base/base_event.dart';
import 'package:MessagesApp/expanded/model/todo.dart';

class DeleteTodoEvent extends BaseEvent {
  Todo todo;
  DeleteTodoEvent(this.todo);
}
