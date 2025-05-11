package com.cosanostra.eventos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.cosanostra.eventos.model.Evento;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long>{
}
