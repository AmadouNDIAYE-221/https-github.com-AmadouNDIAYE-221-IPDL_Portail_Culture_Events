import 'package:appsflutter/task_list_screen.dart'; // Importe l'écran de liste de tâches
import 'package:flutter/material.dart'; // Importe les widgets Flutter
import 'package:provider/provider.dart'; // Importe le package Provider pour la gestion de l'état
import 'database_helper.dart'; // Importe le fichier de gestion de la base de données
import 'task.dart'; // Importe la classe de modèle Task
import 'edit_task_screen.dart'; // Importe l'écran de modification de tâche

void main() async { // Fonction principale de l'application
  WidgetsFlutterBinding.ensureInitialized(); // Initialise le binding Flutter
  DatabaseHelper.initializeDatabaseFactory(); // Initialise la base de données
  runApp(TodoApp()); // Lance l'application TodoApp
}

class TodoApp extends StatelessWidget { // Classe principale de l'application
  @override
  Widget build(BuildContext context) { // Méthode de construction de l'interface utilisateur
    return ChangeNotifierProvider( // Fournit un ChangeNotifier aux widgets descendants
      create: (_) => TaskProvider(), // Crée une instance de TaskProvider
      child: MaterialApp( // Widget principal de l'application
        home: TaskListScreen(), // Écran d'accueil de l'application
      ),
    );
  }
}

class TaskProvider extends ChangeNotifier { // Classe pour la gestion des tâches
  List<Task> _tasks = []; // Liste des tâches
  final DatabaseHelper _databaseHelper = DatabaseHelper(); // Helper pour la base de données

  TaskProvider() { // Constructeur de la classe
    _fetchTasks(); // Charge les tâches depuis la base de données
  }

  List<Task> get tasks => _tasks; // Getter pour la liste des tâches

  Future<void> _fetchTasks() async { // Fonction pour charger les tâches depuis la base de données
    try {
      _tasks = await _databaseHelper.getTasks(); // Récupère les tâches depuis la base de données
      notifyListeners(); // Notifie les écouteurs du changement d'état
    } catch (e) {
      print('Error fetching tasks: $e'); // Affiche une erreur en cas d'échec du chargement des tâches
    }
  }

  Future<void> addTask(Task task) async { // Fonction pour ajouter une tâche
    try {
      await _databaseHelper.insertTask(task); // Insère la tâche dans la base de données
      _fetchTasks(); // Recharge les tâches depuis la base de données
    } catch (e) {
      print('Error adding task: $e'); // Affiche une erreur en cas d'échec de l'ajout de la tâche
    }
  }

  Future<void> updateTask(Task task) async { // Fonction pour mettre à jour une tâche
    try {
      await _databaseHelper.updateTask(task); // Met à jour la tâche dans la base de données
      _fetchTasks(); // Recharge les tâches depuis la base de données
    } catch (e) {
      print('Error updating task: $e'); // Affiche une erreur en cas d'échec de la mise à jour de la tâche
    }
  }

  Future<void> deleteTask(int id) async { // Fonction pour supprimer une tâche
    try {
      await _databaseHelper.deleteTask(id); // Supprime la tâche de la base de données
      _fetchTasks(); // Recharge les tâches depuis la base de données
    } catch (e) {
      print('Error deleting task: $e'); // Affiche une erreur en cas d'échec de la suppression de la tâche
    }
  }
}
