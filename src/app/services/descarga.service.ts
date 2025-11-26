import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import { Turno } from '../modelos/turno.interface'; 

@Injectable({
  providedIn: 'root'
})
export class DescargaService {

  constructor() { }

  downloadUsuariosExcel(data: any[], nombreArchivo: string) {
  this.exportarExcel(data, nombreArchivo);
}

  //  EXCEL 
  exportarExcel(data: any[], nombreArchivo: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.guardarArchivo(excelBuffer, nombreArchivo);
  }

  private guardarArchivo(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + '.xlsx');
  }

  // PDF HISTORIA CLINICA 
  descargarHistoriaClinica(paciente: any, turnos: Turno[]) {
    const doc = new jsPDF();
    const logoUrl = 'assets/logo.png'; 

    // Encabezado
    // doc.addImage(logoUrl, 'PNG', 10, 10, 30, 30); // Descomentar si tienes logo
    doc.setFontSize(18);
    doc.text('Clínica Online - Historia Clínica', 50, 20);
    doc.setFontSize(12);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 50, 30);
    doc.text(`Paciente: ${paciente.nombre} ${paciente.apellido}`, 14, 50);

    // Preparar datos para la tabla

const bodyData = turnos.map((t: any) => [ 
  t.fecha, 
  t.especialidad, 
  t.especialista?.apellido || 'Desconocido', 
  t.historiaClinica?.diagnostico || '-',     
]);
    

    autoTable(doc, {
      startY: 60,
      head: [['Fecha', 'Especialidad', 'Especialista', 'Diagnóstico']],
      body: bodyData,
    });

    doc.save(`historia_clinica_${paciente.apellido}.pdf`);
  }
  
}