package com.hussein.taskmanager.task;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TaskService {
    private final TaskRepository repository;

    public TaskService(TaskRepository repository) { this.repository = repository; }

    public List<Task> findAll() { return repository.findAll(); }

    public Task create(Task task) {
        if (task.getStatus() == null) task.setStatus(TaskStatus.TODO);
        if (task.getPriority() == null) task.setPriority(Priority.MEDIUM);
        return repository.save(task);
    }

    public Task update(Long id, Task input) {
        Task task = findById(id);
        task.setTitle(input.getTitle());
        task.setDescription(input.getDescription());
        task.setStatus(input.getStatus());
        task.setPriority(input.getPriority());
        task.setDeadline(input.getDeadline());
        return repository.save(task);
    }

    public Task changeStatus(Long id, TaskStatus status) {
        Task task = findById(id);
        task.setStatus(status);
        return repository.save(task);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new TaskNotFoundException(id);
        repository.deleteById(id);
    }

    private Task findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
    }
}
