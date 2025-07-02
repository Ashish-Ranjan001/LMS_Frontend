import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-certificate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements OnInit {
  @Input() userName: string = '';
  @Input() courseName: string = '';
  @Input() showDownloadButton: boolean = true;

  constructor() { }

  ngOnInit(): void {
    // Initialize component
  }

  async downloadCertificate(): Promise<void> {
    try {
      const certificateElement = document.getElementById('certificate-container');
      
      if (!certificateElement) {
        console.error('Certificate element not found');
        return;
      }

      // Hide the download button temporarily
      const downloadBtn = document.getElementById('download-btn');
      if (downloadBtn) {
        downloadBtn.style.display = 'none';
      }

      // Create canvas from HTML element
      const canvas = await html2canvas(certificateElement, {
        useCORS: true,
        allowTaint: true,
        width: certificateElement.offsetWidth,
        height: certificateElement.offsetHeight
      });
      

      // Show the download button again
      if (downloadBtn) {
        downloadBtn.style.display = 'block';
      }

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate dimensions to fit the certificate properly
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculate aspect ratio and fit to page
      const imgAspectRatio = imgWidth / imgHeight;
      const pdfAspectRatio = pdfWidth / pdfHeight;
      
      let finalWidth, finalHeight;
      
      if (imgAspectRatio > pdfAspectRatio) {
        // Image is wider, fit to width
        finalWidth = pdfWidth - 20; // Leave some margin
        finalHeight = finalWidth / imgAspectRatio;
      } else {
        // Image is taller, fit to height
        finalHeight = pdfHeight - 20; // Leave some margin
        finalWidth = finalHeight * imgAspectRatio;
      }
      
      // Center the image
      const xOffset = (pdfWidth - finalWidth) / 2;
      const yOffset = (pdfHeight - finalHeight) / 2;

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
      
      // Download the PDF
      const fileName = `${this.userName.replace(/\s+/g, '_')}_${this.courseName.replace(/\s+/g, '_')}_Certificate.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the certificate. Please try again.');
    }
  }

  // Method to be called from parent component
  generateCertificate(userName: string, courseName: string): void {
    this.userName = userName;
    this.courseName = courseName;
    setTimeout(() => {
      this.downloadCertificate();
    }, 100);
  }
}