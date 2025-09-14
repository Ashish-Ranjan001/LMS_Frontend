import { Component, type OnInit, type OnDestroy, type ElementRef, ViewChild } from "@angular/core"
import  { ActivatedRoute, Router } from "@angular/router"
import { Subscription } from "rxjs"
import  { ModuleServicesService, VideoModuleResponse } from "../../../services/Module/module-services.service"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

@Component({
  selector: "app-view-video",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./view-video.component.html",
  styleUrls: ["./view-video.component.css"],
})
export class ViewVideoComponent implements OnInit, OnDestroy {
  @ViewChild("moduleVideo") videoElement!: ElementRef<HTMLVideoElement>

  module: VideoModuleResponse | null = null
  loading = true
  error = ""
  moduleId = ""
  videoError = false
  videoLoaded = false
  isPlaying = false
  currentTime = 0
  videoDuration = 0
  volume = 1
  isFullscreen = false
  showControls = true
  controlsTimeout: any

  private subscription = new Subscription()

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private moduleService: ModuleServicesService,
  ) {}

  ngOnInit(): void {
    this.moduleId = this.route.snapshot.paramMap.get("id") || ""
    this.showControls = true // Add this line to ensure controls are visible by default

    if (this.moduleId) {
      this.loadModule()
    } else {
      this.error = "Module ID is required"
      this.loading = false
    }

    // Listen for fullscreen changes
    document.addEventListener("fullscreenchange", this.onFullscreenChange.bind(this))
    document.addEventListener("webkitfullscreenchange", this.onFullscreenChange.bind(this))
    document.addEventListener("mozfullscreenchange", this.onFullscreenChange.bind(this))
    document.addEventListener("MSFullscreenChange", this.onFullscreenChange.bind(this))
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout)
    }

    // Remove fullscreen event listeners
    document.removeEventListener("fullscreenchange", this.onFullscreenChange.bind(this))
    document.removeEventListener("webkitfullscreenchange", this.onFullscreenChange.bind(this))
    document.removeEventListener("mozfullscreenchange", this.onFullscreenChange.bind(this))
    document.removeEventListener("MSFullscreenChange", this.onFullscreenChange.bind(this))
  }

  loadModule(): void {
    this.loading = true
    this.error = ""
    this.videoError = false
    this.videoLoaded = false

    const sub = this.moduleService.getVideoModuleById(this.moduleId).subscribe({
      next: (response) => {
        this.module = response.data
        console.log("Module loaded:", this.module)
        this.loading = false
      },
      error: (err) => {
        this.error = "Failed to load module. Please try again."
        this.loading = false
        console.error("Error loading module:", err)
      },
    })

    this.subscription.add(sub)
  }

  onVideoError(): void {
    this.videoError = true
    this.videoLoaded = false
    console.error("Video failed to load")
  }

  onVideoLoad(): void {
    this.videoLoaded = true
    this.videoError = false
    this.showControls = true // Add this line
    console.log("Video loaded successfully")
  }

  onVideoTimeUpdate(event: Event): void {
    const target = event.target as HTMLVideoElement
    this.currentTime = target.currentTime
  }

  onVideoLoadedMetadata(event: Event): void {
    const target = event.target as HTMLVideoElement
    this.videoDuration = target.duration
  }

  togglePlayPause(): void {
    const video = document.getElementById("moduleVideo") as HTMLVideoElement
    if (video) {
      if (video.paused) {
        video
          .play()
          .then(() => {
            this.isPlaying = true
          })
          .catch((error) => {
            console.error("Error playing video:", error)
          })
      } else {
        video.pause()
        this.isPlaying = false
      }
    }
  }

  seekTo(event: MouseEvent): void {
    const video = document.getElementById("moduleVideo") as HTMLVideoElement
    const target = event.target as HTMLElement

    if (video && video.duration && target) {
      const rect = target.getBoundingClientRect()
      const pos = (event.clientX - rect.left) / rect.width
      video.currentTime = pos * video.duration
    }
  }

  adjustVolume(event: Event): void {
    const video = document.getElementById("moduleVideo") as HTMLVideoElement
    const target = event.target as HTMLInputElement

    if (video && target) {
      this.volume = Number.parseFloat(target.value)
      video.volume = this.volume
    }
  }

  toggleFullscreen(): void {
    const videoContainer = document.getElementById("videoContainer")
    if (videoContainer) {
      if (!document.fullscreenElement) {
        videoContainer
          .requestFullscreen()
          .then(() => {
            this.isFullscreen = true
          })
          .catch((err) => {
            console.error("Error attempting to enable fullscreen:", err)
          })
      } else {
        document
          .exitFullscreen()
          .then(() => {
            this.isFullscreen = false
          })
          .catch((err) => {
            console.error("Error attempting to exit fullscreen:", err)
          })
      }
    }
  }

  onFullscreenChange(): void {
    this.isFullscreen = !!document.fullscreenElement
  }

  onMouseMove(): void {
    this.showControls = true
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout)
    }
    // Only hide controls in fullscreen mode and when playing
    if (this.isFullscreen && this.isPlaying) {
      this.controlsTimeout = setTimeout(() => {
        this.showControls = false
      }, 3000)
    }
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return "00:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  goBack(category_id:string): void {
    if( category_id=='') {
     console.log(category_id)
     console.log("category_id is empty, navigating to course-detail")
      this.router.navigate(["/categories"])
    }else{
      console.log(category_id)
      this.router.navigate(['/course-detail', category_id])
    }
  }

  retry(): void {
    this.loadModule()
  }

  openVideoInNewTab(): void {
    if (this.module && this.module.videopath) {
      window.open(this.module.videopath, "_blank")
    }
  }
  // onPdf(){
  //   this.module?.pdfpath
  // }
  onPdf() {
    console.log("PDF Path:", this.module?.pdfPath);
  window.open(this.module?.pdfPath || '', '_blank');
}
}
