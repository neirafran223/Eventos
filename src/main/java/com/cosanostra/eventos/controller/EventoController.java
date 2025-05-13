package com.cosanostra.eventos.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cosanostra.eventos.model.Evento;
import com.cosanostra.eventos.service.EventoService;

@CrossOrigin(origins = "http://127.0.0.1:3000")
@RestController
@RequestMapping("/api/v1/evento")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    @GetMapping 
    public ResponseEntity<List<Evento>> Listar() {
        List<Evento> evento = eventoService.findAll();
        if (evento.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(evento);
    }

    @PostMapping
    public ResponseEntity<Evento> guardar(@RequestBody Evento evento) {
        Evento eventonuevo = eventoService.save(evento);
        return ResponseEntity.status(HttpStatus.CREATED).body(eventonuevo);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Evento> buscar(@PathVariable Integer id) {
        try {
            Evento evento = eventoService.findById(id);
            return ResponseEntity.ok(evento);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Evento> actualizar(@PathVariable Integer id, @RequestBody Evento evento) {
        try {
            Evento evn = eventoService.findById(id);
            evn.setId(id);
            evn.setNombre(evento.getNombre());
            evn.setUbicacion(evento.getUbicacion());
            evn.setFecha(evento.getFecha());
            evn.setHora(evento.getHora());
            evn.setCantPersonas(evento.getCantPersonas());
            evn.setCantSeguridad(evento.getCantSeguridad());
            evn.setTipoEvento(evento.getTipoEvento());

            eventoService.save(evn);
            return ResponseEntity.ok(evento);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            eventoService.delate(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}

