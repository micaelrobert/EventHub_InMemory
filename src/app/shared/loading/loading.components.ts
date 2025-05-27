import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { LoadingService } from "../../services/loading.service"

@Component({
  selector: "app-loading",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loadingService.loading$ | async" class="loading-overlay">
      <div class="loading-container">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <p class="loading-text">Carregando...</p>
      </div>
    </div>
  `,
  styles: [
    `
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      animation: fadeIn 0.3s ease;
    }

    .loading-container {
      background: rgba(255, 255, 255, 0.95);
      padding: 3rem 2rem;
      border-radius: 20px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .loading-spinner {
      position: relative;
      width: 60px;
      height: 60px;
      margin: 0 auto 1.5rem;
    }

    .spinner-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 3px solid transparent;
      border-top: 3px solid #667eea;
      border-radius: 50%;
      animation: spin 1.2s linear infinite;
    }

    .spinner-ring:nth-child(2) {
      width: 80%;
      height: 80%;
      top: 10%;
      left: 10%;
      border-top-color: #f093fb;
      animation-duration: 1s;
      animation-direction: reverse;
    }

    .spinner-ring:nth-child(3) {
      width: 60%;
      height: 60%;
      top: 20%;
      left: 20%;
      border-top-color: #764ba2;
      animation-duration: 0.8s;
    }

    .loading-text {
      color: #1a1a1a;
      font-weight: 500;
      font-size: 1rem;
      margin: 0;
      letter-spacing: 0.5px;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `,
  ],
})
export class LoadingComponent {
  loadingService = inject(LoadingService)
}
