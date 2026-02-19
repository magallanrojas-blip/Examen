package com.example.demo.service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;

import com.example.demo.model.Reserva;

@Service
public class ReservaPdfService {

    public byte[] generarComprobante(Reserva r) {
        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage();
            doc.addPage(page);

            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");

            try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {
                cs.setFont(PDType1Font.HELVETICA_BOLD, 16);
                cs.beginText();
                cs.newLineAtOffset(50, 750);
                cs.showText("INFORMACIÓN DE COMPROBANTE EN PDF");
                cs.endText();

                cs.setFont(PDType1Font.HELVETICA_BOLD, 14);
                cs.beginText();
                cs.newLineAtOffset(50, 725);
                cs.showText("HOTEL DESARROLLO DE SW II");
                cs.endText();

                int y = 690;
                int step = 18;

                cs.setFont(PDType1Font.HELVETICA, 12);

                y = writeLine(cs, y, step, "Huésped: " + r.getHuesped().getNombre());
                y = writeLine(cs, y, step, "DNI: " + r.getHuesped().getDni());
                y = writeLine(cs, y, step, "Habitación: " + r.getHabitacion().getNumero());
                y = writeLine(cs, y, step, "Tipo: " + r.getHabitacion().getTipoHabitacion().getNombre());
                y = writeLine(cs, y, step, "Detalle: " + r.getHabitacion().getTipoHabitacion().getDescripcion());
                y = writeLine(cs, y, step, "Fecha ingreso: " + r.getFechaInicio().format(fmt));
                y = writeLine(cs, y, step, "Fecha salida: " + r.getFechaFin().format(fmt));
                y = writeLine(cs, y, step, "Noches: " + r.getNoches());
                y = writeLine(cs, y, step, "Precio por noche: " + r.getPrecioNoche());
                y = writeLine(cs, y, step, "TOTAL: " + r.getTotal());

                cs.setFont(PDType1Font.HELVETICA_OBLIQUE, 10);
                cs.beginText();
                cs.newLineAtOffset(50, 80);
                cs.showText("Comprobante de reserva");
                cs.endText();
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            doc.save(out);
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generando PDF", e);
        }
    }

    private int writeLine(PDPageContentStream cs, int y, int step, String text) throws Exception {
        cs.beginText();
        cs.newLineAtOffset(50, y);
        cs.showText(text);
        cs.endText();
        return y - step;
    }
}
