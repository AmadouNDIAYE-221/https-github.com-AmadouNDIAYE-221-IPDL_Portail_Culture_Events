import 'package:flutter/material.dart'; // Importation du package Flutter pour les widgets
import 'package:provider/provider.dart'; // Importation du package Provider pour la gestion de l'état
import 'main.dart'; // Importation de la classe principale de l'application
import 'task.dart'; // Importation de la classe Task

// Classe représentant l'écran d'ajout de tâche
class AddTaskScreen extends StatefulWidget {
  @override
  _AddTaskScreenState createState() => _AddTaskScreenState(); // Création de l'état de l'écran d'ajout de tâche
}

class _AddTaskScreenState extends State<AddTaskScreen> {
  final _formKey = GlobalKey<FormState>(); // Clé globale pour le formulaire
  String _title = ''; // Titre de la tâche
  String _description = ''; // Description de la tâche
  TaskStatus? _status; // Statut de la tâche (peut être null)

  @override
  Widget build(BuildContext context) {
    return Scaffold( // Widget de base pour la structure de la page
      appBar: AppBar(
        // Barre d'application en haut de la page
        title: Text(
          'Todo App', // Titre de l'application
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white), // Style du texte
        ),
        backgroundColor: Color(0xFF333333), // Couleur de l'arrière-plan de l'app bar
        iconTheme: IconThemeData(color: Colors.white), // Thème des icônes de la barre d'application
      ),
      body: Padding( // Marge intérieure de la page
        padding: EdgeInsets.all(16.0), // Espacement uniforme de 16 pixels
        child: Form( // Formulaire pour la saisie des données de la tâche
          key: _formKey, // Clé du formulaire
          child: Column( // Colonne de widgets pour organiser verticalement les éléments
            crossAxisAlignment: CrossAxisAlignment.start, // Alignement des éléments à gauche
            children: [
              Row( // Ligne de widgets pour organiser horizontalement les éléments
                mainAxisAlignment: MainAxisAlignment.spaceBetween, // Alignement des éléments sur l'espace entre eux
                children: [
                  Text( // Texte statique pour indiquer la section "Ajouter"
                    'Ajouter',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF333333)), // Style du texte
                  ),
                  Container( // Conteneur pour le menu déroulant du statut de la tâche
                    padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0), // Remplissage interne du conteneur
                    decoration: BoxDecoration( // Décoration du conteneur
                      color: Colors.white, // Couleur de fond blanche
                      borderRadius: BorderRadius.circular(8.0), // Coins arrondis du conteneur
                      border: Border.all(color: Colors.grey), // Bordure grise autour du conteneur
                    ),
                    child: DropdownButtonHideUnderline( // Masque le soulignement du menu déroulant
                      child: DropdownButton<TaskStatus>( // Menu déroulant pour sélectionner le statut de la tâche
                        hint: Row( // Ligne de widgets pour afficher l'icône et le texte du statut par défaut
                          children: [
                            Icon( // Icône par défaut (cercle gris)
                              Icons.circle,
                              color: Colors.grey,
                              size: 24,
                            ),
                            SizedBox(width: 8), // Espace horizontal
                            Text('Statut'), // Texte par défaut du statut
                          ],
                        ),
                        value: _status, // Valeur sélectionnée dans le menu déroulant (peut être null)
                        items: TaskStatus.values.map((TaskStatus status) { // Liste des éléments du menu déroulant basée sur les valeurs de l'énumération TaskStatus
                          return DropdownMenuItem<TaskStatus>( // Élément du menu déroulant
                            value: status, // Valeur de l'élément
                            child: Row( // Ligne de widgets pour afficher l'icône et le texte du statut
                              children: [
                                Icon( // Icône du statut
                                  Icons.circle,
                                  color: getStatusColor(status), // Couleur basée sur le statut
                                  size: 24,
                                ),
                                SizedBox(width: 8), // Espace horizontal
                                Text(status.toString().split('.').last), // Texte du statut
                              ],
                            ),
                          );
                        }).toList(), // Convertit les valeurs de l'énumération en liste d'éléments de menu déroulant
                        onChanged: (TaskStatus? newValue) { // Fonction appelée lorsque la valeur du menu déroulant change
                          setState(() { // Met à jour l'état de l'écran
                            _status = newValue!; // Attribue la nouvelle valeur de statut
                          });
                        },
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 20), // Espace vertical de 20 pixels
              Container( // Conteneur pour le champ de saisie du titre de la tâche
                decoration: BoxDecoration( // Décoration du conteneur
                  color: Colors.white, // Couleur de fond blanche
                  borderRadius: BorderRadius.circular(8.0), // Coins arrondis du conteneur
                  border: Border.all(color: Colors.grey), // Bordure grise autour du conteneur
                ),
                child: TextFormField( // Champ de saisie de texte pour le titre de la tâche
                  decoration: InputDecoration( // Décoration du champ de saisie
                    labelText: 'Titre de la tâche', // Texte de l'étiquette
                    border: InputBorder.none, // Pas de bordure
                    contentPadding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0), // Espacement interne du champ de saisie
                  ),
                  validator: (value) { // Fonction de validation du champ de saisie
                    if (value == null || value.isEmpty) { // Vérifie si le champ est vide
                      return 'Veuillez entrer un titre'; // Message d'erreur
                    }
                    return null; // Pas d'erreur
                  },
                  onSaved: (value) { // Fonction appelée lorsque le champ de saisie est sauvegardé
                    _title = value!; // Attribue la valeur du champ de saisie au titre de la tâche
                  },
                ),
              ),
              SizedBox(height: 20), // Espace vertical de 20 pixels
              Container( // Conteneur pour le champ de saisie de la description de la tâche
                decoration: BoxDecoration( // Décoration du conteneur
                  color: Colors.white, // Couleur de fond blanche

                  borderRadius: BorderRadius.circular(8.0), // Coins arrondis du conteneur
                  border: Border.all(color: Colors.grey), // Bordure grise autour du conteneur
                ),
                child: TextFormField( // Champ de saisie de texte pour la description de la tâche
                  decoration: InputDecoration( // Décoration du champ de saisie
                    labelText: 'Description', // Texte de l'étiquette
                    border: InputBorder.none, // Pas de bordure
                    contentPadding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0), // Espacement interne du champ de saisie
                  ),
                  validator: (value) { // Fonction de validation du champ de saisie
                    if (value == null || value.isEmpty) { // Vérifie si le champ est vide
                      return 'Veuillez entrer une description'; // Message d'erreur
                    }
                    return null; // Pas d'erreur
                  },
                  onSaved: (value) { // Fonction appelée lorsque le champ de saisie est sauvegardé
                    _description = value!; // Attribue la valeur du champ de saisie à la description de la tâche
                  },
                  maxLines: 3, // Nombre maximum de lignes pour le champ de saisie
                ),
              ),
              SizedBox(height: 20), // Espace vertical de 20 pixels
              Center( // Centre les éléments horizontalement dans la colonne
                child: ElevatedButton( // Bouton d'action pour ajouter la tâche
                  onPressed: () { // Fonction appelée lorsque le bouton est pressé
                    if (_formKey.currentState!.validate()) { // Vérifie si le formulaire est valide
                      _formKey.currentState!.save(); // Sauvegarde les valeurs du formulaire
                      Provider.of<TaskProvider>(context, listen: false).addTask( // Ajoute la tâche à la liste des tâches
                        Task(title: _title, description: _description, status: _status!), // Crée une nouvelle tâche avec les données saisies
                      );
                      Navigator.pop(context); // Retourne à l'écran précédent
                    }
                  },
                  style: ElevatedButton.styleFrom( // Style du bouton
                    backgroundColor: Color(0xFF333333), // Couleur de fond du bouton
                    padding: EdgeInsets.symmetric(horizontal: 50, vertical: 15), // Remplissage interne du bouton
                    textStyle: TextStyle(fontSize: 18), // Style du texte du bouton
                  ),
                  child: Text('Ajouter', style: TextStyle(color: Colors.white)), // Texte du bouton
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Color getStatusColor(TaskStatus status) { // Fonction pour obtenir la couleur en fonction du statut de la tâche
    switch (status) { // Sélectionne la couleur en fonction du statut
      case TaskStatus.Todo: // Si le statut est "À faire"
        return Color(0xFF70726e); // Retourne une couleur spécifique
      case TaskStatus.InProgress: // Si le statut est "En cours"
        return Color(0xFF56CCF2); // Retourne une couleur spécifique
      case TaskStatus.Done: // Si le statut est "Terminé"
        return Color(0xFF27AE60); // Retourne une couleur spécifique
      case TaskStatus.Bug: // Si le statut est "Bogue"
        return Color(0xFFEB5757); // Retourne une couleur spécifique
      default: // Par défaut
        return Colors.black; // Retourne une couleur par défaut
    }
  }
}


