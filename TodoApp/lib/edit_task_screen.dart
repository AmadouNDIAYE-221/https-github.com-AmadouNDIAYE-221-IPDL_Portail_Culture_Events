import 'package:flutter/material.dart'; // Importation du package flutter pour les widgets
import 'package:provider/provider.dart'; // Importation du package provider pour la gestion des états
import 'main.dart'; // Importation du fichier main.dart
import 'task.dart'; // Importation du fichier task.dart

class EditTaskScreen extends StatefulWidget { // Classe représentant l'écran de modification de tâche
  final Task task; // Tâche à modifier

  EditTaskScreen({required this.task}); // Constructeur prenant une tâche comme argument

  @override
  _EditTaskScreenState createState() => _EditTaskScreenState(); // Crée l'état de l'écran de modification de tâche
}

class _EditTaskScreenState extends State<EditTaskScreen> { // État de l'écran de modification de tâche
  final _formKey = GlobalKey<FormState>(); // Clé globale pour le formulaire
  late String _title; // Titre de la tâche
  late String _description; // Description de la tâche
  TaskStatus? _status; // Statut de la tâche

  @override
  void initState() { // Méthode appelée lors de l'initialisation de l'état
    super.initState(); // Appel de la méthode initState de la classe parent
    _title = widget.task.title; // Initialisation du titre avec celui de la tâche passée en paramètre
    _description = widget.task.description; // Initialisation de la description avec celle de la tâche passée en paramètre
    _status = widget.task.status; // Initialisation du statut avec celui de la tâche passée en paramètre
  }

  @override
  Widget build(BuildContext context) { // Méthode de construction de l'interface utilisateur
    return Scaffold( // Retourne un widget Scaffold
      appBar: AppBar( // Barre d'applications
        title: Text( // Texte du titre de la barre d'applications
          'Todo App', // Titre de l'application
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white), // Style du texte
        ),
        backgroundColor: Color(0xFF333333), // Couleur de fond de la barre d'applications
        iconTheme: IconThemeData(color: Colors.white), // Thème des icônes de la barre d'applications
      ),
      body: Padding( // Espacement intérieur
        padding: EdgeInsets.all(16.0), // Espacement uniforme
        child: Form( // Formulaire
          key: _formKey, // Clé du formulaire
          child: Column( // Colonne de widgets
            crossAxisAlignment: CrossAxisAlignment.start, // Alignement en début de ligne
            children: [ // Liste de widgets enfants
              Row( // Ligne de widgets
                mainAxisAlignment: MainAxisAlignment.spaceBetween, // Alignement des widgets sur l'axe principal
                children: [ // Liste de widgets enfants
                  Text( // Texte
                    'Modifier', // Texte à afficher
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF333333)), // Style du texte
                  ),
                  Container( // Conteneur
                    padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0), // Remplissage intérieur
                    decoration: BoxDecoration( // Décoration du conteneur
                      color: Colors.white, // Couleur de fond
                      borderRadius: BorderRadius.circular(8.0), // Bordures arrondies
                      border: Border.all(color: Colors.grey), // Bordure grise
                    ),
                    child: DropdownButtonHideUnderline( // Masque le soulignement du bouton déroulant
                      child: DropdownButton<TaskStatus>( // Bouton déroulant pour le statut de la tâche
                        hint: Row( // Ligne de widgets
                          children: [ // Liste de widgets enfants
                            Icon( // Icône
                              Icons.circle, // Icône de cercle
                              color: getStatusColor(_status), // Couleur en fonction du statut
                              size: 24, // Taille de l'icône
                            ),
                            SizedBox(width: 8), // Espace horizontal
                            Text(_status?.toString().split('.').last ?? 'Statut'), // Texte du statut
                          ],
                        ),
                        value: _status, // Valeur sélectionnée
                        items: TaskStatus.values.map((TaskStatus status) { // Éléments du bouton déroulant
                          return DropdownMenuItem<TaskStatus>( // Élément du bouton déroulant
                            value: status, // Valeur de l'élément
                            child: Row( // Ligne de widgets
                              children: [ // Liste de widgets enfants
                                Icon( // Icône
                                  Icons.circle, // Icône de cercle
                                  color: getStatusColor(status), // Couleur en fonction du statut
                                  size: 24, // Taille de l'icône
                                ),
                                SizedBox(width: 8), // Espace horizontal
                                Text(status.toString().split('.').last), // Texte du statut
                              ],
                            ),
                          );
                        }).toList(), // Convertit la liste des valeurs en liste de widgets
                        onChanged: (TaskStatus? newValue) { // Appelé lorsque la valeur du bouton déroulant change
                          setState(() { // Met à jour l'état du widget
                            _status = newValue!; // Attribue la nouvelle valeur au statut
                          });
                        },
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 20), // Espace vertical
              Container( // Conteneur pour le champ de saisie du titre de la tâche
                decoration: BoxDecoration( // Décoration du conteneur
                  color: Colors.white, // Couleur de fond
                  borderRadius: BorderRadius.circular(8.0), // Bordures arrondies
                  border: Border.all(color: Colors.grey), // Bordure grise
                ),
                child: TextFormField( // Champ de saisie pour le titre de la tâche
                  initialValue: _title, // Valeur initiale du champ de saisie
                  decoration: InputDecoration( // Décoration du champ de saisie
                    labelText: 'Titre de la tâche', // Étiquette du champ de saisie
                    border: InputBorder.none, // Supprime la bordure
                    contentPadding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0), // Remplissage intérieur
                  ),
                  validator: (value) { // Fonction de validation du champ de saisie
                    if (value == null || value.isEmpty) { // Vérifie si le champ est vide
                      return 'Veuillez entrer un titre'; // Message d'erreur si le champ est vide
                    }
                    return null; // Renvoie null si la validation réussit
                  },
                  onSaved: (value) { // Fonction appelée lors de la sauvegarde du champ de saisie
                    _title = value!; // Met à jour le titre avec la nouvelle valeur saisie
                  },
                ),
              ),
              SizedBox(height: 20), // Espace vertical
              Container( // Conteneur pour le champ de saisie de la description de la tâche
                decoration: BoxDecoration( // Décoration du conteneur
                  color: Colors.white, // Couleur de fond
                  borderRadius: BorderRadius.circular(8.0), // Bordures arrondies
                  border: Border.all(color: Colors.grey), // Bordure grise
                ),
                child: TextFormField( // Champ de saisie pour la description de la tâche
                  initialValue: _description, // Valeur initiale du champ de saisie
                  decoration: InputDecoration( // Décoration du champ de saisie
                    labelText: 'Description', // Étiquette du champ de saisie
                    border: InputBorder.none, // Supprime la bordure
                    contentPadding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0), // Remplissage intérieur
                  ),
                  validator: (value) { // Fonction de validation du champ de saisie
                    if (value == null || value.isEmpty) { // Vérifie si le champ est vide
                      return 'Veuillez entrer une description'; // Message d'erreur si le champ est vide
                    }
                    return null; // Renvoie null si la validation réussit
                  },
                  onSaved: (value) { // Fonction appelée lors de la sauvegarde du champ de saisie
                    _description = value!; // Met à jour la description avec la nouvelle valeur saisie
                  },
                  maxLines: 3, // Nombre maximal de lignes
                ),
              ),
              SizedBox(height: 20), // Espace vertical
              Center( // Centre le contenu
                child: ElevatedButton( // Bouton d'action
                  onPressed: () { // Action lors du clic sur le bouton
                    if (_formKey.currentState!.validate()) { // Vérifie si le formulaire est valide
                      _formKey.currentState!.save(); // Sauvegarde les valeurs du formulaire
                      final updatedTask = Task( // Crée une nouvelle tâche mise à jour
                        id: widget.task.id, // ID de la tâche
                        title: _title, // Titre de la tâche
                        description: _description, // Description de la tâche
                        status: _status!, // Statut de la tâche
                      );
                      Provider.of<TaskProvider>(context, listen: false).updateTask(updatedTask); // Met à jour la tâche dans le provider
                      Navigator.pop(context); // Retourne à l'écran précédent
                    }
                  },
                  style: ElevatedButton.styleFrom( // Style du bouton
                    backgroundColor: Color(0xFF333333), // Couleur de fond
                    padding: EdgeInsets.symmetric(horizontal: 50, vertical: 15), // Remplissage intérieur
                    textStyle: TextStyle(fontSize: 18), // Style du texte
                  ),
                  child: Text('Modifier', style: TextStyle(color: Colors.white)), // Texte du bouton
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Color getStatusColor(TaskStatus? status) { // Fonction pour obtenir la couleur en fonction du statut de la tâche
    switch (status) { // Structure de contrôle de flux switch
      case TaskStatus.Todo: // Cas où le statut est "À faire"
        return Color(0xFF70726e); // Renvoie la couleur correspondante
      case TaskStatus.InProgress: // Cas où le statut est "En cours"
        return Color(0xFF56CCF2); // Renvoie la couleur correspondante
      case TaskStatus.Done: // Cas où le statut est "Terminé"
        return Color(0xFF27AE60); // Renvoie la couleur correspondante
      case TaskStatus.Bug: // Cas où le statut est "Bogue"
        return Color(0xFFEB5757); // Renvoie la couleur correspondante
      default: // Par défaut
        return Colors.grey; // Renvoie une couleur grise
    }
  }
}
