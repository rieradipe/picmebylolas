package com.lolas.picmebylolas;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.ActiveProfiles;

import com.lolas.picmebylolas.controller.web.PingController;

@ActiveProfiles("test")
@WebMvcTest(PingController.class)
@AutoConfigureMockMvc(addFilters = false)
@Disabled("Evitar levantar todo el ApplicationContext mientras montamos tests de slice")
class PicmebylolasApplicationTests {
	@Test
	void contextLoads() {
	}
}
