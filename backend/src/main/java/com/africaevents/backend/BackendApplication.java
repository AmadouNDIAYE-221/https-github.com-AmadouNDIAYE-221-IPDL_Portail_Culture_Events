package com.africaevents.backend;
import com.africaevents.backend.entity.Destination;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import com.africaevents.backend.repository.DestinationRepository;

import com.africaevents.backend.entity.Highlight;
import java.util.Arrays;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
    CommandLineRunner initData(DestinationRepository destinationRepository) {
        return args -> {
            // Créer une destination : Paris
            Destination paris = new Destination();
            paris.setName("Paris");
            paris.setDescription("Ville lumière");
            paris.setHistory("Riche histoire");
            paris.setImage("https://example.com/paris.jpg");
            paris.setSlug("paris");
            paris.setHighlights(Arrays.asList(new Highlight("Tour Eiffel", "Symbole de Paris")));
            paris.setGallery(Arrays.asList("https://example.com/paris1.jpg", "https://example.com/paris2.jpg"));
            destinationRepository.save(paris);

            // Créer une autre destination : Cape Town
            Destination capeTown = new Destination();
            capeTown.setName("Cape Town");
            capeTown.setDescription("Ville au bord de l'océan");
            capeTown.setHistory("Histoire coloniale");
            capeTown.setImage("https://example.com/capetown.jpg");
            capeTown.setSlug("cape-town");
            capeTown.setHighlights(Arrays.asList(new Highlight("Table Mountain", "Vue panoramique")));
            capeTown.setGallery(Arrays.asList("https://example.com/capetown1.jpg", "https://example.com/capetown2.jpg"));
            destinationRepository.save(capeTown);
        };
    }

}
