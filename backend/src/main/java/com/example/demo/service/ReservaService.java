package com.example.demo.service;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

import com.example.demo.model.Habitacion;
import com.example.demo.model.Reserva;
import com.example.demo.repository.HabitacionRepository;
import com.example.demo.repository.ReservaRepository;

@Service
public class ReservaService {

	private final ReservaRepository reservaRepo;
	private final HabitacionRepository habitacionRepo;

	public ReservaService(ReservaRepository reservaRepo, HabitacionRepository habitacionRepo) {
		this.reservaRepo = reservaRepo;
		this.habitacionRepo = habitacionRepo;
	}

	public List<Reserva> listar() {
		return reservaRepo.findAll();
	}

	public Reserva guardar(Reserva reserva) {

		Habitacion habitacion = habitacionRepo.findById(reserva.getHabitacion().getIdHabitacion()).orElseThrow();

		long noches = ChronoUnit.DAYS.between(reserva.getFechaInicio(), reserva.getFechaFin());

		if (noches <= 0) {
			throw new RuntimeException("La fecha fin debe ser mayor que fecha inicio");
		}

		BigDecimal precio = habitacion.getTipoHabitacion().getPrecioNoche();

		BigDecimal total = precio.multiply(BigDecimal.valueOf(noches));

		reserva.setNoches((int) noches);
		reserva.setPrecioNoche(precio);
		reserva.setTotal(total);

		return reservaRepo.save(reserva);
	}

	public void eliminar(Integer id) {
		reservaRepo.deleteById(id);
	}

	public Reserva obtenerPorId(Integer id) {
		return reservaRepo.findById(id).orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + id));
	}

}
