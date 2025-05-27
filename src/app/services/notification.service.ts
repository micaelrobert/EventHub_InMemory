import { Injectable, inject } from "@angular/core"
import { MatSnackBar } from "@angular/material/snack-bar"

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private snackBar = inject(MatSnackBar)

  success(message: string, duration = 3000): void {
    this.snackBar.open(message, "Fechar", {
      duration,
      panelClass: ["success-snackbar"],
      horizontalPosition: "end",
      verticalPosition: "top",
    })
  }

  error(message: string, duration = 5000): void {
    this.snackBar.open(message, "Fechar", {
      duration,
      panelClass: ["error-snackbar"],
      horizontalPosition: "end",
      verticalPosition: "top",
    })
  }

  info(message: string, duration = 3000): void {
    this.snackBar.open(message, "Fechar", {
      duration,
      panelClass: ["info-snackbar"],
      horizontalPosition: "end",
      verticalPosition: "top",
    })
  }

  warning(message: string, duration = 4000): void {
    this.snackBar.open(message, "Fechar", {
      duration,
      panelClass: ["warning-snackbar"],
      horizontalPosition: "end",
      verticalPosition: "top",
    })
  }
}
