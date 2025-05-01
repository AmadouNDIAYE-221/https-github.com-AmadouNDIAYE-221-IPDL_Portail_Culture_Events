import 'package:path/path.dart'; // Importation de la bibliothèque path pour manipuler les chemins de fichiers
import 'package:sqflite_common_ffi/sqflite_ffi.dart'; // Importation de sqflite_ffi pour l'utilisation de SQLite avec FFI
import 'package:sqflite/sqflite.dart'; // Importation de sqflite pour l'utilisation de SQLite
import 'task.dart'; // Importation de la classe Task

class DatabaseHelper {
  static late DatabaseFactory databaseFactory; // Factory pour créer des bases de données

  static void initializeDatabaseFactory() {
    databaseFactory = databaseFactoryFfi; // Initialisation de la factory de la base de données à FFI
  }

  static final DatabaseHelper _instance = DatabaseHelper._internal(); // Instance singleton de la classe DatabaseHelper
  factory DatabaseHelper() => _instance; // Constructeur factory pour accéder à l'instance singleton
  static Database? _database; // Instance de la base de données SQLite

  DatabaseHelper._internal(); // Constructeur privé pour empêcher l'instanciation directe de la classe

  Future<Database> get database async {
    if (_database != null) return _database!; // Retourne la base de données si elle existe déjà
    _database = await _initDatabase(); // Sinon, initialise la base de données et la stocke
    return _database!; // Retourne la base de données
  }

  Future<Database?> _initDatabase() async {
    try {
      String path = join(await getDatabasesPath(), 'todo_database.db'); // Chemin de la base de données
      return await openDatabase(
        path, // Chemin de la base de données
        version: 1, // Version de la base de données
        onCreate: _onCreate, // Fonction appelée lors de la création de la base de données
      );
    } catch (e) {
      print('Error initializing database: $e'); // Affiche une erreur en cas d'échec de l'initialisation de la base de données
      return null;
    }
  }

  Future<void> _onCreate(Database db, int version) async {
    await db.execute(
      '''
      CREATE TABLE tasks( // Crée une table 'tasks' dans la base de données
        id INTEGER PRIMARY KEY AUTOINCREMENT, // Champ ID auto-incrémenté
        title TEXT, // Champ pour le titre de la tâche
        description TEXT, // Champ pour la description de la tâche
        status TEXT // Champ pour le statut de la tâche
      )
      ''',
    );
  }

  Future<List<Task>> getTasks() async {
    final db = await database; // Obtient une référence à la base de données
    final List<Map<String, dynamic>> maps = await db.query('tasks'); // Exécute une requête pour récupérer toutes les tâches

    return List.generate(maps.length, (i) {
      return Task(
        id: maps[i]['id'], // Récupère l'identifiant de la tâche depuis la base de données
        title: maps[i]['title'], // Récupère le titre de la tâche depuis la base de données
        description: maps[i]['description'], // Récupère la description de la tâche depuis la base de données
        status: TaskStatus.values.firstWhere((e) => e.toString() == 'TaskStatus.' + maps[i]['status']), // Récupère le statut de la tâche depuis la base de données
      );
    });
  }

  Future<void> insertTask(Task task) async {
    final db = await database; // Obtient une référence à la base de données
    await db.insert(
      'tasks', // Nom de la table
      task.toMap(), // Convertit la tâche en une map de clés dynamiques
      conflictAlgorithm: ConflictAlgorithm.replace, // Algorithme de résolution de conflit
    );
  }

  Future<void> updateTask(Task task) async {
    final db = await database; // Obtient une référence à la base de données
    await db.update(
      'tasks', // Nom de la table
      task.toMap(), // Convertit la tâche en une map de clés dynamiques
      where: 'id = ?', // Clause WHERE pour la mise à jour
      whereArgs: [task.id], // Arguments de la clause WHERE
    );
  }

  Future<void> deleteTask(int id) async {
    final db = await database; // Obtient une référence à la base de données
    await db.delete(
      'tasks', // Nom de la table
      where: 'id = ?', // Clause WHERE pour la suppression
      whereArgs: [id], // Arguments de la clause WHERE
    );
  }
}
