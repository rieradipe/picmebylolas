package com.lolas.picmebylolas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@EnableJpaAuditing
@ConfigurationPropertiesScan
public class PicmebylolasApplication {
	public static void main(String[] args) {
		SpringApplication.run(PicmebylolasApplication.class, args);
	}
}
