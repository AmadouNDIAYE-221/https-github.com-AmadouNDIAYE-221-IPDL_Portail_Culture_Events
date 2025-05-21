package com.africaevents.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
public class StorageService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    /**
     * Stocke un fichier dans le système de fichiers local
     * @param file Fichier à stocker
     * @param eventId ID de l'événement associé (optionnel)
     * @return URL du fichier stocké
     * @throws IOException
     */
    public String storeFile(MultipartFile file, String eventId) throws IOException {
        // Créer le répertoire de stockage s'il n'existe pas
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Générer un nom de fichier unique
        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String fileExtension = "";
        if (originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

        // Créer un sous-dossier pour l'événement si l'eventId est fourni
        Path targetLocation;
        String relativeFilePath;

        if (eventId != null && !eventId.isEmpty()) {
            Path eventPath = uploadPath.resolve(eventId);
            if (!Files.exists(eventPath)) {
                Files.createDirectories(eventPath);
            }
            targetLocation = eventPath.resolve(uniqueFilename);
            relativeFilePath = eventId + "/" + uniqueFilename;
        } else {
            targetLocation = uploadPath.resolve(uniqueFilename);
            relativeFilePath = uniqueFilename;
        }

        // Copier le fichier dans le répertoire cible
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        // S'assurer que le chemin est correct et accessible
        System.out.println("Fichier enregistru00e9 u00e0: " + targetLocation.toAbsolutePath());
        
        // Retourner l'URL publique du fichier
        return "/api/uploads/" + relativeFilePath;
    }

    /**
     * Supprime un fichier du système de fichiers local
     * @param fileId Identifiant du fichier à supprimer
     * @throws IOException
     */
    public void deleteFile(String fileId) throws IOException {
        Path filePath = Paths.get(uploadDir).resolve(fileId);
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        } else {
            throw new IOException("Fichier non trouvé: " + fileId);
        }
    }
}
