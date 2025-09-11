package com.lolas.picmebylolas;

import com.lolas.picmebylolas.controller.web.PingController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles("test") // no cargamos seguridad si la marcas con @Profile("!test")
@WebMvcTest(PingController.class)
@AutoConfigureMockMvc(addFilters = false) // sin filtros de Security en MockMvc
class PingControllerTest {

    // truco para que el slice MVC no pida el metamodelo JPA
    @MockBean
    private JpaMetamodelMappingContext jpaMetamodelMappingContext;

    @Autowired
    private MockMvc mockMvc;

    @Test
    void ping_devuelve_pong() throws Exception {
        mockMvc.perform(get("/api/ping")) // usa "/ping" si tu PingController no tiene @RequestMapping("/api")
                .andExpect(status().isOk())
                .andExpect(content().string("pong"));
    }
}
