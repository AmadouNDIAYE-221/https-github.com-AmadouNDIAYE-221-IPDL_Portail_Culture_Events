class Task { // Classe représentant une tâche
  final int? id; // Identifiant de la tâche
  final String title; // Titre de la tâche
  final String description; // Description de la tâche
  final TaskStatus status; // Statut de la tâche

  Task({ // Constructeur de la classe Task
    this.id, // Identifiant de la tâche (peut être null)
    required this.title, // Titre de la tâche (non null)
    required this.description, // Description de la tâche (non null)
    required this.status, // Statut de la tâche (non null)
  });

  Map<String, dynamic> toMap() { // Convertit la tâche en une map de clés dynamiques
    return {
      'id': id, // Identifiant de la tâche
      'title': title, // Titre de la tâche
      'description': description, // Description de la tâche
      'status': status.toString().split('.').last, // Statut de la tâche (converti en String)
    };
  }
}

enum TaskStatus { // Énumération représentant les différents statuts d'une tâche
  Todo, // Tâche à faire
  InProgress, // Tâche en cours
  Done, // Tâche terminée
  Bug, // Tâche signalant un bug
}
