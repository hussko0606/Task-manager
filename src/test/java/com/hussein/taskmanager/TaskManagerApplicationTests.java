package com.hussein.taskmanager;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hussein.taskmanager.task.Priority;
import com.hussein.taskmanager.task.Task;
import com.hussein.taskmanager.task.TaskRepository;
import com.hussein.taskmanager.task.TaskStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class TaskManagerApplicationTests {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired TaskRepository repository;

    @BeforeEach
    void cleanDatabase() {
        repository.deleteAll();
    }

    @Test
    void contextLoads() {}

    @Test
    void createAndListTask() throws Exception {
        Task task = new Task();
        task.setTitle("Sök LIA");
        task.setDescription("Kontakta företag");
        task.setPriority(Priority.HIGH);
        task.setStatus(TaskStatus.TODO);
        task.setDeadline(LocalDate.of(2026, 9, 1));

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Sök LIA"))
                .andExpect(jsonPath("$.status").value("TODO"))
                .andExpect(jsonPath("$.priority").value("HIGH"));

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Sök LIA"));
    }

    @Test
    void changeStatusAndDeleteTask() throws Exception {
        Task task = new Task();
        task.setTitle("Testa appen");
        task.setPriority(Priority.MEDIUM);
        task.setStatus(TaskStatus.TODO);
        Task saved = repository.save(task);

        mockMvc.perform(patch("/api/tasks/{id}/status", saved.getId())
                        .param("status", "DONE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DONE"));

        mockMvc.perform(delete("/api/tasks/{id}", saved.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    void rejectsTaskWithoutTitle() throws Exception {
        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"priority\":\"MEDIUM\",\"status\":\"TODO\"}"))
                .andExpect(status().isBadRequest());
    }
}
