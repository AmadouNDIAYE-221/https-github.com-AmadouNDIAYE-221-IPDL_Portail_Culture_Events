import 'package:flutter/material.dart';
import 'package:provider/provider.dart'; // Importation du package Provider
import 'add_task_screen.dart'; // Importation de l'écran d'ajout de tâche
import 'edit_task_screen.dart'; // Importation de l'écran de modification de tâche
import 'main.dart'; // Importation de la classe principale
import 'task.dart'; // Importation de la classe Task

class TaskListScreen extends StatefulWidget {
  @override
  _TaskListScreenState createState() => _TaskListScreenState();
}

class _TaskListScreenState extends State<TaskListScreen> {
  List<TaskStatus> _selectedStatusList = []; // Liste des statuts sélectionnés pour le filtre

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Todo App', // Titre de l'application
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white), // Style du texte
        ),
        backgroundColor: Color(0xFF333333), // Couleur de l'arrière-plan de l'app bar
        actions: [
          // Actions de l'app bar
          PopupMenuButton(
            icon: Icon(Icons.filter_list, color: Colors.white), // Icône de filtre
            itemBuilder: (BuildContext context) => [
              PopupMenuItem(
                child: StatefulBuilder(
                  builder: (BuildContext context, StateSetter setState) {
                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Filtrer par Statut', // Titre du filtre par statut
                          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold), // Style du texte
                        ),
                        Divider(), // Ligne de séparation
                        ...TaskStatus.values.map((status) {
                          bool isSelected = _selectedStatusList.contains(status); // Vérifie si le statut est sélectionné
                          return CheckboxListTile(
                            title: Text(
                              status.toString().split('.').last, // Texte du statut
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold), // Style du texte
                            ),
                            value: isSelected, // Valeur du checkbox
                            onChanged: (bool? value) {
                              setState(() {
                                if (value != null) {
                                  if (value) {
                                    _selectedStatusList.add(status); // Ajoute le statut à la liste des statuts sélectionnés
                                  } else {
                                    _selectedStatusList.remove(status); // Retire le statut de la liste des statuts sélectionnés
                                  }
                                }
                              });
                              this.setState(() {}); // Met à jour l'état de la page
                            },
                          );
                        }).toList(),
                      ],
                    );
                  },
                ),
              ),
            ],
          ),
        ],
      ),
      body: Consumer<TaskProvider>(
        builder: (context, taskProvider, child) {
          List<Task> filteredTasks = taskProvider.tasks; // Liste des tâches filtrées
          if (_selectedStatusList.isNotEmpty) {
            filteredTasks = filteredTasks.where((task) => _selectedStatusList.contains(task.status)).toList(); // Filtrer les tâches par statut
          }
          return ListView(
            children: filteredTasks.map((task) => TaskCard(task: task)).toList(), // Afficher les tâches filtrées sous forme de liste
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => AddTaskScreen()), // Naviguer vers l'écran d'ajout de tâche lorsqu'on appuie sur le bouton flottant
          );
        },
        child: Icon(Icons.add), // Icône du bouton flottant
      ),
    );
  }
}

class TaskCard extends StatelessWidget {
  final Task task;

  TaskCard({required this.task}); // Constructeur de la classe TaskCard

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => EditTaskScreen(task: task), // Naviguer vers l'écran de modification de tâche lorsqu'on appuie sur une tâche
          ),
        );
      },
      child: Container(
        margin: EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0), // Marge extérieure du conteneur de la tâche
        padding: EdgeInsets.all(16.0), // Remplissage interne du conteneur de la tâche
        decoration: BoxDecoration(
          color: Colors.white, // Couleur de fond du conteneur de la tâche
          borderRadius: BorderRadius.circular(16.0), // Coins arrondis du conteneur de la tâche
          border: Border.all(
            color: getStatusColor(task.status), // Couleur de la bordure basée sur le statut de la tâche
            width: 2.0, // Épaisseur de la bordure
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: ListTile(
                leading: Icon(
                  Icons.circle,
                  color: getStatusColor(task.status), // Couleur de l'icône basée sur le statut de la tâche
                ),
                title: Text(
                  task.title, // Titre de la tâche
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold), // Style du texte du titre de la tâche
                ),
              ),
            ),
            IconButton(
              onPressed: () {
                Provider.of<TaskProvider>(context, listen: false).deleteTask(task.id!); // Supprimer la tâche lorsqu'on appuie sur l'icône de poubelle
              },
              icon: Icon(Icons.delete), // Icône de poubelle
              color: Colors.red, // Couleur de l'icône de poubelle
            ),
          ],
        ),
      ),
    );
  }

  Color getStatusColor(TaskStatus status) {
    switch (status) {
      case TaskStatus.Todo:
        return Color(0xFF70726e); // Couleur grise pour le statut "À faire"
      case TaskStatus.InProgress:
        return Color(0xFF56CCF2); // Couleur bleue pour le statut "En cours"
      case TaskStatus.Done:
        return Color(0xFF27AE60); // Couleur verte pour le statut "Terminé"
      case TaskStatus.Bug:
        return Color(0xFFEB5757); // Couleur rouge pour le statut "Bug"
      default:
        return Colors.black; // Couleur par défaut
    }
  }
}
