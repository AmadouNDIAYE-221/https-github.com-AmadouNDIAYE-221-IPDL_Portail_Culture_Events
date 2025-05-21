package com.africaevents.backend.repository;

import com.africaevents.backend.entity.Destination;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DestinationRepository extends JpaRepository<Destination, Long> {
    // Retourne une liste au lieu d'un Optional pour éviter l'erreur NonUniqueResultException
    List<Destination> findAllBySlug(String slug);
    
    // Conserver l'ancienne méthode pour la compatibilité avec le reste du code
    Optional<Destination> findBySlug(String slug);
}
