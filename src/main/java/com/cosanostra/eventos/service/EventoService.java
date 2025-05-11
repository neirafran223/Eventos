package com.cosanostra.eventos.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cosanostra.eventos.model.Evento;
import com.cosanostra.eventos.repository.EventoRepository;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    public List<Evento> findAll(){
        return eventoRepository.findAll();
    }
    
    public Evento findById(long id){
        return eventoRepository.findById(id).get();
    }

    public Evento save(Evento evento){
        return eventoRepository.save(evento);
    }

    public void delate(long id){
        eventoRepository.deleteById(id);
    }
}
