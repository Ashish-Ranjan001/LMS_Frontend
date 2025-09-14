

import { Component, type OnInit, type OnDestroy, inject, ViewChild, type ElementRef } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { CommonModule } from "@angular/common"
import { Subscription, interval } from "rxjs"
import { HttpClient } from "@angular/common/http"
import { UserLearningService, type CourseDetailDto, type ModuleDto } from "../../../services/user-learning.service"
import { ModuleServicesService } from "../../../services/Module/module-services.service"
import { AssignmentService,  SubmitAssignmentDto } from "../../../services/Assignment/assignment.service"
import { DomSanitizer, type SafeResourceUrl } from "@angular/platform-browser"
import { jwtDecode } from "jwt-decode"
import { CertificateComponent } from "../certificate/certificate.component"

interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
}

@Component({
  selector: "app-course-module-view",
  standalone: true,
  imports: [CommonModule , CertificateComponent],
  templateUrl: "./coursemodulevideocomponent.component.html",
  styleUrl: "./coursemodulevideocomponent.component.css",
})
export class CoursemodulevideocomponentComponent implements OnInit, OnDestroy {
  @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>
  @ViewChild("videoPlayer") videoPlayer!: ElementRef<HTMLVideoElement>
  @ViewChild(CertificateComponent) certificateComponent!: CertificateComponent 

  courseDetail: CourseDetailDto | null = null
  selectedModule: ModuleDto | null = null
  courseId = ""
  userId = ""
  loading = true
  error = ""
  completedModules = 0
  totalModules = 0
  allModulesCompleted = false
  safeVideoUrl: SafeResourceUrl | null = null
  currentVideoData: any = null
  videoLoading = false
  videoWatched = false

  // Enhanced video tracking properties
  videoStarted = false
  videoProgress = 0
  videoDuration = 0
  videoCurrentTime = 0
  videoCompletionThreshold = 0.9 // 90% completion required
  videoProgressTimer: Subscription | null = null
  isVideoCompleted = false
  videoWatchTime = 0
  minimumWatchTime = 5// Minimum 30 seconds watch time
  showVideoOverlay = true // Controls the play button overlay

  // Quiz related properties
  showQuiz = false
  quizQuestions: QuizQuestion[] = []
  currentQuestionIndex = 0
  selectedAnswers: number[] = []
  timeRemaining = 0
  totalQuizTime = 0
  quizCompleted = false
  quizScore = 0
  correctAnswers = 0
  quizTaken = false
  quizStatus = 0
  quizTimer: Subscription | null = null
  isSubmittingQuiz = false

  // Tab switching control
  tabSwitchCount = 0
  maxTabSwitches = 1
  showTabWarning = false

  downloadAssinmentyash = ""
  dstatus = 0
 

  // Assignment submission properties
  isSubmittingAssignment = false
  assignmentSubmitted = false
  selectedFile: File | null = null
  assignmentSubmissionError = ""
  userName:string=''


  showCertificateModal = false
isGeneratingCertificate = false

  // API base URL
  private baseUrl = "https://localhost:7264/api"
  private subscriptions = new Subscription()
  private userLearningService = inject(UserLearningService)
  private moduleService = inject(ModuleServicesService)
  private assignmentService = inject(AssignmentService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private sanitizer = inject(DomSanitizer)
  private http = inject(HttpClient)

  constructor() {
    this.userId = this.getDecodedUserId()
  }

  getDecodedUserId() {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        return ""
      }
      const decodedToken: any = jwtDecode(token)
      const userId = decodedToken.UserId || decodedToken.nameid || decodedToken.sub
      this.userName=decodedToken.Name
      return userId
    } catch (error) {
      return ""
    }
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.params.subscribe((params) => {
        this.courseId = atob(params["courseId"])
        if (this.courseId) {
          this.loadCourseData()
        }
      }),
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
    if (this.quizTimer) {
      this.quizTimer.unsubscribe()
    }
    if (this.videoProgressTimer) {
      this.videoProgressTimer.unsubscribe()
    }
    this.removeQuizEventListeners()
  }

  refreshAssignmentStatus(): void {
    if (this.userId && this.courseId) {
      this.userLearningService.getAssignment(this.courseId, this.userId).subscribe({
        next: (data: any) => {
          if (data.userProgress && this.courseDetail) {
            this.courseDetail.assignmentDownloadStatus = data.userProgress.assignmentDownloaded
          }
        },
        error: (error) => {
          console.error("❌ Error refreshing assignment status:", error)
        },
      })
    }
  }

  loadCourseData(): void {
    this.loading = true
    this.error = ""
    this.subscriptions.add(
      this.userLearningService.getCourseDetail(this.courseId, this.userId).subscribe({
        next: (courseDetail) => {
          this.courseDetail = courseDetail
          this.userLearningService.getAssignment(this.courseId, this.userId).subscribe({
            next: (data: any) => {
              console.log(data)
              this.downloadAssinmentyash = data.userProgress.assignmentFile
              this.dstatus = data.userProgress.assignmentDownloadStatus
              this.quizStatus = data.userProgress.quizStatus
              if (data.userProgress && data.userProgress.assignmentDownloaded !== undefined) {
                this.courseDetail!.assignmentDownloadStatus = data.userProgress.assignmentDownloaded
              }
              
              // RECALCULATE PROGRESS AFTER QUIZ STATUS IS LOADED
              this.processCourseData()
            },
            error: (error) => {
              console.error("❌ Error loading assignment data:", error)
              this.processCourseData() // Still process course data even if assignment loading fails
            },
          })
          this.loading = false
        },
        error: (error) => {
          this.error = "Failed to load course data"
          this.loading = false
          console.error("Error loading course:", error)
        },
      }),
    )
  }

  downloadCourseCertificate(): void {
    if (!this.isCourseFullyCompleted()) {
      alert('Please complete all course requirements before downloading the certificate.');
      return;
    }
  
    // Show certificate modal
    this.showCertificateModal = true;
    
    // Wait for Angular to render the certificate component
    setTimeout(() => {
      if (this.certificateComponent) {
        this.isGeneratingCertificate = true;
        
        // Generate and download certificate
        this.certificateComponent.generateCertificate(
          this.userName, 
          this.courseDetail?.courseName || ''
        );
        
        // Hide modal and reset state after download
        setTimeout(() => {
          this.showCertificateModal = false;
          this.isGeneratingCertificate = false;
        }, 2000);
      }
    }, 100);
  }


  closeCertificateModal(): void {
    this.showCertificateModal = false;
  }

  // processCourseData(): void {
  //   if (this.courseDetail?.modules) {
  //     this.courseDetail.modules.sort((a, b) => a.order - b.order)
  //     this.totalModules = this.courseDetail.modules.length
  //     this.completedModules = this.courseDetail.modules.filter((m) => m.isCompleted).length
  //     this.allModulesCompleted = this.completedModules === this.totalModules

  //     if (!this.courseDetail.progress) {
  //       this.courseDetail.progress = Math.round((this.completedModules / this.totalModules) * 100)
  //     }

  //     const firstIncompleteModule = this.courseDetail.modules.find((m) => !m.isCompleted)
  //     this.selectedModule = firstIncompleteModule || this.courseDetail.modules[0]

  //     if (this.selectedModule) {
  //       this.loadModuleData(this.selectedModule)
  //     }
  //   }
  // }
  processCourseData(): void {
    if (this.courseDetail?.modules) {
      this.courseDetail.modules.sort((a, b) => a.order - b.order)
      this.totalModules = this.courseDetail.modules.length
      this.completedModules = this.courseDetail.modules.filter((m) => m.isCompleted).length
      this.allModulesCompleted = this.completedModules === this.totalModules
  
      // UPDATED PROGRESS CALCULATION
      if (!this.courseDetail.progress) {
        this.courseDetail.progress = this.calculateOverallProgress()
      }
  
      const firstIncompleteModule = this.courseDetail.modules.find((m) => !m.isCompleted)
      this.selectedModule = firstIncompleteModule || this.courseDetail.modules[0]
  
      if (this.selectedModule) {
        this.loadModuleData(this.selectedModule)
      }
    }
  }

  selectModule(module: ModuleDto): void {
    this.selectedModule = module
    this.resetVideoTracking()
    // Only set videoWatched to true if module is already completed
    this.videoWatched = module.isCompleted
    this.loadModuleData(module)
  }

  private resetVideoTracking(): void {
    this.videoStarted = false
    this.videoProgress = 0
    this.videoDuration = 0
    this.videoCurrentTime = 0
    this.isVideoCompleted = false
    this.videoWatchTime = 0
    this.showVideoOverlay = true // Reset overlay to show
    if (this.videoProgressTimer) {
      this.videoProgressTimer.unsubscribe()
      this.videoProgressTimer = null
    }
  }

  private loadModuleData(module: ModuleDto): void {
    this.safeVideoUrl = null
    this.currentVideoData = null
    this.resetVideoTracking()

    if (module.videoUrl) {
      this.setVideoUrl(module.videoUrl)
    } else {
      this.loadVideoData(module.moduleId)
    }
  }

  loadVideoData(moduleId: string): void {
    this.videoLoading = true
    this.subscriptions.add(
      this.moduleService.getVideoModuleById(moduleId).subscribe({
        next: (response) => {
          this.currentVideoData = response.data
          if (this.currentVideoData?.videopath) {
            this.setVideoUrl(this.currentVideoData.videopath)
          }
          this.videoLoading = false
        },
        error: (error) => {
          console.error("Error loading video data:", error)
          this.videoLoading = false
        },
      }),
    )
  }

  setVideoUrl(url: string): void {
    if (!url) {
      this.safeVideoUrl = null
      return
    }

    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1]?.split("&")[0]
      if (videoId) {
        this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=0&enablejsapi=1`,
        )
      }
    } else if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0]
      if (videoId) {
        this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=0&enablejsapi=1`,
        )
      }
    } else if (url.includes("youtube.com/embed/")) {
      this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url + "&enablejsapi=1")
    } else if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1]?.split("?")[0]
      if (videoId) {
        this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://player.vimeo.com/video/${videoId}`)
      }
    } else if (url.startsWith("http") || url.startsWith("//")) {
      this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url)
    } else {
      const fullUrl = url.startsWith("/") ? `https://localhost:7264${url}` : url
      this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl)
    }

    // Set up video tracking after URL is set
    setTimeout(() => {
      this.setupVideoTracking()
    }, 1000)
  }

  // private setupVideoTracking(): void {
  //   // For YouTube videos, we'll use postMessage API
  //   if (this.safeVideoUrl && this.safeVideoUrl.toString().includes("youtube.com/embed")) {
  //     this.setupYouTubeTracking()
  //   } else {
  //     // For other video types, use HTML5 video events
  //     this.setupHTML5VideoTracking()
  //   }
  // }

  private setupVideoTracking(): void {
    console.log("🔧 Setting up video tracking for:", this.safeVideoUrl?.toString())
    
    // For YouTube videos, we'll use postMessage API
    if (this.safeVideoUrl && this.safeVideoUrl.toString().includes("youtube.com/embed")) {
      console.log("📺 Setting up YouTube tracking")
      this.setupYouTubeTracking()
    } else {
      console.log("📹 Setting up HTML5 video tracking")
      // For other video types, use HTML5 video events
      this.setupHTML5VideoTracking()
    }
  }

  private setupYouTubeTracking(): void {
    // Listen for YouTube player messages
    window.addEventListener("message", (event) => {
      if (event.origin !== "https://www.youtube.com") return

      if (event.data && typeof event.data === "string") {
        try {
          const data = JSON.parse(event.data)
          if (data.event === "video-progress") {
            this.handleVideoProgress(data.info.currentTime, data.info.duration)
          }
        } catch (e) {
          // Handle non-JSON messages
        }
      }
    })
  }

  // private setupHTML5VideoTracking(): void {
  //   // This would be used for direct video files
  //   const videoElement = document.querySelector("video")
  //   if (videoElement) {
  //     videoElement.addEventListener("loadedmetadata", () => {
  //       this.videoDuration = videoElement.duration
  //     })

  //     videoElement.addEventListener("timeupdate", () => {
  //       this.handleVideoProgress(videoElement.currentTime, videoElement.duration)
  //     })

  //     videoElement.addEventListener("play", () => {
  //       if (!this.videoStarted) {
  //         this.startWatchingVideo()
  //       }
  //     })

  //     videoElement.addEventListener("ended", () => {
  //       this.onVideoCompleted()
  //     })
  //   }
  // }

  private setupHTML5VideoTracking(): void {
    setTimeout(() => {
      const videoElement = document.querySelector("video") as HTMLVideoElement
      if (videoElement) {
        console.log("🎬 HTML5 video element found, setting up tracking")
        
        videoElement.addEventListener("loadedmetadata", () => {
          this.videoDuration = videoElement.duration
          console.log("📏 Video duration loaded:", this.videoDuration)
        })
  
        videoElement.addEventListener("timeupdate", () => {
          this.handleVideoProgress(videoElement.currentTime, videoElement.duration)
        })
  
        videoElement.addEventListener("play", () => {
          console.log("▶️ Video play event triggered")
          if (!this.videoStarted) {
            this.startWatchingVideo()
          }
        })
  
        videoElement.addEventListener("ended", () => {
          console.log("🏁 Video ended event triggered")
          this.onVideoCompleted()
        })
      } else {
        console.log("❌ No HTML5 video element found")
      }
    }, 2000) // Wait 2 seconds for video to load
  }

  // private handleVideoProgress(currentTime: number, duration: number): void {
  //   this.videoCurrentTime = currentTime
  //   this.videoDuration = duration

  //   if (duration > 0) {
  //     this.videoProgress = (currentTime / duration) * 100

  //     // Check if video is completed (90% watched)
  //     if (this.videoProgress >= this.videoCompletionThreshold * 100 && !this.isVideoCompleted) {
  //       this.onVideoCompleted()
  //     }
  //   }
  // }
  private handleVideoProgress(currentTime: number, duration: number): void {
    this.videoCurrentTime = currentTime
    this.videoDuration = duration
  
    if (duration > 0) {
      this.videoProgress = (currentTime / duration) * 100
  
      console.log("📊 handleVideoProgress:", {
        currentTime: currentTime.toFixed(2),
        duration: duration.toFixed(2),
        progress: this.videoProgress.toFixed(2),
        threshold: this.videoCompletionThreshold * 100
      })
  
      // Check if video is completed (90% watched)
      if (this.videoProgress >= this.videoCompletionThreshold * 100 && !this.isVideoCompleted) {
        console.log("🎯 Progress threshold reached, calling onVideoCompleted")
        this.onVideoCompleted()
      }
    }
  }

  // UPDATED: This method now only removes the overlay and starts tracking
  // startWatchingVideo(): void {
  //   if (!this.videoStarted) {
  //     this.videoStarted = true
  //     this.showVideoOverlay = false // Remove the play button overlay
  //     console.log("🎬 VIDEO START DEBUG:", {
  //       moduleName: this.selectedModule?.moduleName,
  //       videoUrl: this.selectedModule?.videoUrl,
  //       timestamp: new Date().toISOString()
  //     })

  //     // Start tracking watch time
  //     this.videoProgressTimer = interval(1000).subscribe(() => {
  //       this.videoWatchTime++

  //       console.log("⏱️ VIDEO PROGRESS DEBUG:", {
  //         watchTime: this.videoWatchTime,
  //         videoDuration: this.videoDuration,
  //         videoProgress: this.videoProgress.toFixed(2),
  //         currentTime: this.videoCurrentTime,
  //         completionThreshold: this.videoCompletionThreshold * 100,
  //         minimumWatchTime: this.minimumWatchTime,
  //         isVideoCompleted: this.isVideoCompleted
  //       })

  //       // For demonstration purposes, let's simulate video progress
  //       // In a real scenario, this would come from the video player events
  //       if (this.videoDuration === 0) {
  //         // Simulate a 2-minute video for testing
  //         this.videoDuration = 120
  //       }

  //       // Simulate video progress (this is just for testing - remove in production)
  //       if (this.videoWatchTime <= this.videoDuration) {
  //         this.videoProgress = (this.videoWatchTime / this.videoDuration) * 100

  //         // Check completion
  //         if (
  //           this.videoProgress >= this.videoCompletionThreshold * 100 &&
  //           this.videoWatchTime >= this.minimumWatchTime &&
  //           !this.isVideoCompleted
  //         ) {
  //           this.onVideoCompleted()
  //         }
  //       }
  //     })
  //   }
  // }

  startWatchingVideo(): void {
    if (!this.videoStarted) {
      this.videoStarted = true
      this.showVideoOverlay = false
      
      // 🔍 DEBUG: Log video start
      console.log("🎬 VIDEO START DEBUG:", {
        moduleName: this.selectedModule?.moduleName,
        videoUrl: this.selectedModule?.videoUrl,
        timestamp: new Date().toISOString()
      })
  
      // Start tracking watch time
      this.videoProgressTimer = interval(1000).subscribe(() => {
        this.videoWatchTime++
  
        // 🔍 DEBUG: Log every second of watching
        // console.log("⏱️ VIDEO PROGRESS DEBUG:", {
        //   watchTime: this.videoWatchTime,
        //   videoDuration: this.videoDuration,
        //   videoProgress: this.videoProgress.toFixed(2),
        //   currentTime: this.videoCurrentTime,
        //   completionThreshold: this.videoCompletionThreshold * 100,
        //   minimumWatchTime: this.minimumWatchTime,
        //   isVideoCompleted: this.isVideoCompleted
        // })
  
        // For demonstration purposes with better duration detection
        if (this.videoDuration === 0) {
          // Try to get duration from video element
          const videoElement = document.querySelector('video') as HTMLVideoElement
          const iframe = document.querySelector('iframe')
          
          if (videoElement && videoElement.duration && !isNaN(videoElement.duration)) {
            this.videoDuration = videoElement.duration
            console.log("📹 DURATION DETECTED from video element:", this.videoDuration)
          } else if (iframe && iframe.src.includes('youtube')) {
            // For YouTube videos, we'll simulate based on typical short video length
            this.videoDuration = Math.max(30, this.videoWatchTime + 10) // Minimum 30s or current time + 10s
            console.log("📹 DURATION ESTIMATED for YouTube:", this.videoDuration)
          } else {
            // Fallback: assume it's a short video
            this.videoDuration = Math.max(this.videoWatchTime + 5, 20) // At least 20 seconds
            console.log("📹 DURATION FALLBACK:", this.videoDuration)
          }
        }
  
        // Calculate progress
        if (this.videoDuration > 0) {
          this.videoProgress = (this.videoWatchTime / this.videoDuration) * 100
          this.videoCurrentTime = this.videoWatchTime // Simulate current time
  
          // 🔍 DEBUG: Progress calculation
          // console.log("📊 PROGRESS CALCULATION:", {
          //   calculation: `${this.videoWatchTime} / ${this.videoDuration} * 100`,
          //   result: this.videoProgress.toFixed(2),
          //   thresholdReached: this.videoProgress >= (this.videoCompletionThreshold * 100),
          //   minTimeReached: this.videoWatchTime >= this.minimumWatchTime
          // })
  
          // Check completion with enhanced logging
          if (this.videoProgress >= this.videoCompletionThreshold * 100 && 
              this.videoWatchTime >= this.minimumWatchTime && 
              !this.isVideoCompleted) {
            
            console.log("🎯 VIDEO COMPLETION CRITERIA MET:", {
              progress: this.videoProgress,
              watchTime: this.videoWatchTime,
              duration: this.videoDuration,
              threshold: this.videoCompletionThreshold * 100,
              minTime: this.minimumWatchTime
            })
            
            this.onVideoCompleted()
          }
        }
      })
    }
  }
  

  private onVideoCompleted(): void {
    console.log("🎉 onVideoCompleted() CALLED - Starting completion check...")
    
    if (this.isVideoCompleted) {
      console.log("❌ Already completed, returning early")
      return
    }
  
    // 🔍 DEBUG: Complete status check
    console.log("🔍 COMPLETION STATUS CHECK:", {
      videoWatchTime: this.videoWatchTime,
      minimumWatchTime: this.minimumWatchTime,
      videoProgress: this.videoProgress,
      completionThreshold: this.videoCompletionThreshold * 100,
      meetsTimeRequirement: this.videoWatchTime >= this.minimumWatchTime,
      meetsProgressRequirement: this.videoProgress >= this.videoCompletionThreshold * 100
    })
  
    // Check if minimum watch time is met and video progress is sufficient
    if (this.videoWatchTime >= this.minimumWatchTime && 
        this.videoProgress >= this.videoCompletionThreshold * 100) {
      
      this.isVideoCompleted = true
      this.videoWatched = true
  
      console.log("✅ VIDEO SUCCESSFULLY COMPLETED!", {
        finalProgress: this.videoProgress.toFixed(1) + "%",
        finalWatchTime: this.videoWatchTime + " seconds",
        videoDuration: this.videoDuration + " seconds",
        timestamp: new Date().toISOString()
      })
  
      // Stop the watch time timer
      if (this.videoProgressTimer) {
        this.videoProgressTimer.unsubscribe()
        this.videoProgressTimer = null
        console.log("⏹️ Video progress timer stopped")
      }
  
      // Show completion message
      this.showVideoCompletionMessage()
    } else {
      console.log("❌ COMPLETION CRITERIA NOT MET:", {
        timeCheck: `${this.videoWatchTime} >= ${this.minimumWatchTime}`,
        progressCheck: `${this.videoProgress.toFixed(2)} >= ${this.videoCompletionThreshold * 100}`,
        timeResult: this.videoWatchTime >= this.minimumWatchTime,
        progressResult: this.videoProgress >= this.videoCompletionThreshold * 100
      })
    }
  }

  // private onVideoCompleted(): void {
  //   if (this.isVideoCompleted) return

  //   // Check if minimum watch time is met and video progress is sufficient
  //   if (this.videoWatchTime >= this.minimumWatchTime && this.videoProgress >= this.videoCompletionThreshold * 100) {
  //     this.isVideoCompleted = true
  //     this.videoWatched = true // NOW we set videoWatched to true

  //     console.log("✅ Video completed! Progress:", this.videoProgress.toFixed(1) + "%")
  //     console.log("✅ Watch time:", this.videoWatchTime + " seconds")

  //     // Stop the watch time timer
  //     if (this.videoProgressTimer) {
  //       this.videoProgressTimer.unsubscribe()
  //       this.videoProgressTimer = null
  //     }

  //     // Show completion message
  //     this.showVideoCompletionMessage()
  //   }
  // }

  private showVideoCompletionMessage(): void {
    console.log("🎉 Video completed! You can now mark this module as complete.")
  }

  // UPDATED: Remove the automatic videoWatched setting after 5 seconds
  onVideoLoad(): void {
    console.log("Video loaded successfully")
    // Removed the setTimeout that was setting videoWatched = true after 5 seconds
    // Now video must be actually watched to completion
  }

  playVideo(module: ModuleDto): void {
    this.selectModule(module)
  }

  downloadModulePdf(module: ModuleDto): void {
    if (module.documentPath) {
      const pdfUrl = `https://localhost:7264/${module.documentPath}`
      const link = document.createElement("a")
      link.href = pdfUrl
      link.target = "_blank"
      link.rel = "noopener noreferrer"
      const filename = module.documentPath.split("/").pop() || "module-document.pdf"
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      console.error("No document path available for this module")
    }
  }

  downloadPdf(module: ModuleDto): void {
    if (module.documentPath) {
      const link = document.createElement("a")
      link.href = module.documentPath
      link.target = "_blank"
      link.rel = "noopener noreferrer"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      this.markModuleAsCompleted(module)
    }
  }

  markModuleAsCompleted(module: ModuleDto): void {
    if (!module.isCompleted) {
      const progressData = {
        userId: this.userId,
        courseId: this.courseId,
        moduleId: module.moduleId,
      }

      this.subscriptions.add(
        this.userLearningService.updateModuleProgress(progressData).subscribe({
          next: () => {
            module.isCompleted = true
            this.updateProgress()
            this.loadCourseData()
          },
          error: (error) => {
            console.error("Error updating progress:", error)
          },
        }),
      )
    }
  }

  markCurrentModuleAsCompleted(): void {
    if (this.selectedModule && !this.selectedModule.isCompleted && this.canCompleteModule()) {
      this.markModuleAsCompleted(this.selectedModule)
    }
  }

  // UPDATED: Enhanced logic to check if module can be completed
  // canCompleteModule(): boolean {
  //   if (!this.selectedModule) return false

  //   // If module is already completed, return false
  //   if (this.selectedModule.isCompleted) return false

  //   // Check if module has video content
  //   const hasVideo = this.selectedModule.videoUrl || this.currentVideoData?.videopath

  //   if (hasVideo) {
  //     // For video modules, require COMPLETE video watching (not just started)
  //     return this.isVideoCompleted && this.videoWatched
  //   } else {
  //     // For non-video modules (like PDF only), allow completion
  //     return true
  //   }
  // }

  canCompleteModule(): boolean {
    if (!this.selectedModule) {
      console.log("❌ canCompleteModule: No selected module")
      return false
    }
  
    // If module is already completed, return false
    if (this.selectedModule.isCompleted) {
      console.log("❌ canCompleteModule: Module already completed")
      return false
    }
  
    // Check if module has video content
    const hasVideo = this.selectedModule.videoUrl || this.currentVideoData?.videopath
  
    console.log("🔍 canCompleteModule CHECK:", {
      hasVideo: hasVideo,
      isVideoCompleted: this.isVideoCompleted,
      videoWatched: this.videoWatched,
      videoProgress: this.videoProgress,
      videoWatchTime: this.videoWatchTime
    })
  
    if (hasVideo) {
      // For video modules, require COMPLETE video watching
      const canComplete = this.isVideoCompleted && this.videoWatched
      console.log("📹 Video module completion check:", canComplete)
      return canComplete
    } else {
      // For non-video modules (like PDF only), allow completion
      console.log("📄 Non-video module - can complete")
      return true
    }
  }
  
  

  // updateProgress(): void {
  //   if (this.courseDetail?.modules) {
  //     this.completedModules = this.courseDetail.modules.filter((m) => m.isCompleted).length
  //     this.allModulesCompleted = this.completedModules === this.totalModules
  //     this.courseDetail.progress = Math.round((this.completedModules / this.totalModules) * 100)

  //     if (this.allModulesCompleted) {
  //       this.courseDetail.isCompleted = true
  //     }
  //   }
  // }

  updateProgress(): void {
    if (this.courseDetail?.modules) {
      this.completedModules = this.courseDetail.modules.filter((m) => m.isCompleted).length
      this.allModulesCompleted = this.completedModules === this.totalModules
      
      // UPDATED PROGRESS CALCULATION
      this.courseDetail.progress = this.calculateOverallProgress()
  
      if (this.allModulesCompleted && this.quizStatus === 2) {
        this.courseDetail.isCompleted = true
      }
    }
  }

  private calculateOverallProgress(): number {
    if (this.totalModules === 0) return 0
    
    // Calculate module progress (80% weight)
    const moduleProgress = (this.completedModules / this.totalModules) * 80
    
    // Calculate quiz progress (20% weight)
    const quizProgress = this.quizStatus === 2 ? 20 : 0
    
    // Combined progress
    const totalProgress = moduleProgress + quizProgress
    
    return Math.round(totalProgress)
  }

  // Get video completion status text
  getVideoCompletionStatus(): string {
    if (!this.selectedModule) return ""

    const hasVideo = this.selectedModule.videoUrl || this.currentVideoData?.videopath
    if (!hasVideo) return ""

    if (this.selectedModule.isCompleted) {
      return "✅ Module Completed"
    } else if (this.isVideoCompleted && this.videoWatched) {
      return "✅ Video Completed - Ready to mark as complete"
    } else if (this.videoStarted) {
      return `📺 Watching... ${this.videoProgress.toFixed(1)}% completed (${this.videoWatchTime}s watched)`
    } else {
      return "▶️ Click play to start watching"
    }
  }

  // Helper methods for the enhanced button
  getButtonText(): string {
    if (this.selectedModule?.isCompleted) {
      return "Completed"
    } else if (this.canCompleteModule()) {
      return "Mark as Complete"
    } else {
      const hasVideo = this.selectedModule?.videoUrl || this.currentVideoData?.videopath
      if (hasVideo) {
        if (!this.videoStarted) {
          return "Start Video First"
        } else {
          return "Complete Video First"
        }
      } else {
        return "Mark as Complete"
      }
    }
  }

  getButtonTooltip(): string {
    if (this.selectedModule?.isCompleted) {
      return "This module has been completed"
    } else if (this.canCompleteModule()) {
      return "Click to mark this module as complete"
    } else {
      const hasVideo = this.selectedModule?.videoUrl || this.currentVideoData?.videopath
      if (hasVideo) {
        if (!this.videoStarted) {
          return "Start watching the video to track progress"
        } else if (this.videoProgress < this.videoCompletionThreshold * 100) {
          return `Watch ${Math.ceil(this.videoCompletionThreshold * 100 - this.videoProgress)}% more of the video`
        } else if (this.videoWatchTime < this.minimumWatchTime) {
          return `Watch for ${this.minimumWatchTime - this.videoWatchTime} more seconds`
        }
      }
      return "Complete the required activities first"
    }
  }

  isDownloading = false

downloadAssignment(): void {
  // Don't proceed if no assignment available
  if (!this.downloadAssinmentyash) {
    return
  }

  if (this.isDownloading) return

  this.isDownloading = true

  if (this.userId && this.courseId) {
    this.userLearningService.downloadAssignment(this.userId, this.courseId).subscribe({
      next: (response: any) => {
        if (this.courseDetail) {
          this.courseDetail.assignmentDownloadStatus = 1
        }
        this.performFileDownload()
        this.isDownloading = false
      },
      error: (error: any) => {
        console.error("❌ Error recording assignment download:", error)
        this.performFileDownload()
        if (this.courseDetail) {
          this.courseDetail.assignmentDownloadStatus = 1
        }
        this.isDownloading = false
      },
    })
  } else {
    this.performFileDownload()
    this.isDownloading = false
  }
}

isButtonDisabled(): boolean {
  // Disable if: no assignment available, already downloaded, or currently downloading
  return !this.downloadAssinmentyash || this.dstatus == 1 || this.isDownloading
}

// Helper method to check if assignment is available
hasAssignment(): boolean {
  return !!(this.downloadAssinmentyash && this.downloadAssinmentyash.trim())
}


// Helper method to get button icon class
getButtonIcon(): string {
  if (!this.hasAssignment()) {
    return "fas fa-exclamation-circle" // or "fas fa-ban" or "fas fa-times-circle"
  }
  
  if (this.isDownloading) {
    return "fas fa-spinner fa-spin"
  }
  
  if (this.dstatus === 1) {
    return "fas fa-check"
  }
  
  return "fas fa-download"
}

private performFileDownload(): void {
  const anchor = document.createElement("a")
  anchor.href = this.downloadAssinmentyash
  anchor.target = "_blank"
  anchor.rel = "noopener noreferrer"
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  console.log("📁 File download triggered")
}
  // Assignment submission methods
  openFileUpload(): void {
    this.fileInput.nativeElement.click()
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0]
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
      ]
      if (!allowedTypes.includes(file.type)) {
        alert("Please select a PDF or Word document (.pdf, .docx, .doc)")
        return
      }

      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        alert("File size must be less than 10MB")
        return
      }

      this.selectedFile = file
      this.submitAssignment()
    }
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1]
        resolve(base64String)
      }
      reader.onerror = () => {
        reject(new Error("Failed to read file"))
      }
      reader.readAsDataURL(file)
    })
  }

  async submitAssignment(): Promise<void> {
    if (!this.selectedFile || !this.userId || !this.courseId) {
      console.error("Missing required data for assignment submission")
      return
    }

    const confirmed = confirm(
      `📄 Submit Assignment\n\n` +
        `File: ${this.selectedFile.name}\n` +
        `Size: ${(this.selectedFile.size / 1024 / 1024).toFixed(2)} MB\n\n` +
        `Are you sure you want to submit this assignment?`,
    )

    if (!confirmed) {
      this.selectedFile = null
      if (this.fileInput) {
        this.fileInput.nativeElement.value = ""
      }
      return
    }

    this.isSubmittingAssignment = true
    this.assignmentSubmissionError = ""

    console.log("🚀 Starting assignment submission...")

    try {
      const base64File = await this.convertFileToBase64(this.selectedFile)

      const submitData: SubmitAssignmentDto = {
        UserId: this.userId,
        CourseId: this.courseId,
        assignment_sme_file: base64File,
      }

      this.subscriptions.add(
        this.assignmentService.submitAssignment(submitData).subscribe({
          next: (response: any) => {
            console.log("✅ Assignment submitted successfully:", response)

            alert(`✅ Assignment submitted successfully!\n\nFile: ${this.selectedFile?.name}\nStatus: Under Review`)

            this.assignmentSubmitted = true
            this.isSubmittingAssignment = false
            this.selectedFile = null

            if (this.fileInput) {
              this.fileInput.nativeElement.value = ""
            }

            this.loadCourseData()
          },
          error: (error: any) => {
            console.error("❌ Error submitting assignment:", error)

            let errorMessage = "Failed to submit assignment. Please try again."

            if (error.status === 400) {
              errorMessage = "Invalid submission data. Please check your file and try again."
            } else if (error.status === 404) {
              errorMessage = "Course enrollment not found. Please contact support."
            } else if (error.status === 500) {
              errorMessage = "Server error. Please try again later."
            } else if (error.status === 0) {
              errorMessage = "Network error. Please check your connection."
            }

            this.assignmentSubmissionError = errorMessage
            alert(`❌ Assignment Submission Failed\n\n${errorMessage}`)

            this.isSubmittingAssignment = false
            this.selectedFile = null

            if (this.fileInput) {
              this.fileInput.nativeElement.value = ""
            }
          },
        }),
      )
    } catch (fileError) {
      console.error("❌ Error converting file to base64:", fileError)

      this.assignmentSubmissionError = "Failed to process file. Please try again."
      alert(`❌ File Processing Failed\n\nFailed to process file. Please try again.`)

      this.isSubmittingAssignment = false
      this.selectedFile = null

      if (this.fileInput) {
        this.fileInput.nativeElement.value = ""
      }
    }
  }

  canSubmitAssignment(): boolean {
    return this.dstatus === 1 && !this.assignmentSubmitted && !this.isSubmittingAssignment
  }

  getAssignmentSubmissionStatus(): string {
    if (this.assignmentSubmitted) {
      return "Submitted - Under Review"
    } else if (this.dstatus === 1) {
      return "Ready to Submit"
    } else {
      return "Download Assignment First"
    }
  }

  // ===== QUIZ FUNCTIONALITY =====
  startQuiz(): void {
    if (this.quizTaken) {
      return
    }

    const confirmed = confirm(
      "🎯 Ready to take the quiz?\n\n" +
        "⚠️ Important Instructions:\n" +
        "• You will have 1 minute per question\n" +
        "• The screen will be monitored during the quiz\n" +
        "• You cannot skip questions or go back\n" +
        "• The quiz will auto-submit when time runs out\n" +
        "• Tab switching is limited - be careful!\n\n" +
        "Do you want to proceed?",
    )
    if (confirmed && this.courseDetail?.quizPath) {
      this.loadQuizData()
    }
  }

  loadQuizData(): void {
    if (!this.courseDetail?.quizPath) {
      console.error("No quiz path available")
      return
    }

    const quizUrl = `https://localhost:7264${this.courseDetail.quizPath}`
    this.subscriptions.add(
      this.http.get(quizUrl, { responseType: "text" }).subscribe({
        next: (csvData) => {
          this.parseCSV(csvData)
          this.initializeQuiz()
        },
        error: (error) => {
          console.error("Error loading quiz data:", error)
          alert("Failed to load quiz. Please try again.")
        },
      }),
    )
  }

  parseCSV(csvData: string): void {
    const lines = csvData.split("\n")
    const questions: QuizQuestion[] = []

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue

      const columns = lines[i].split(",")
      if (columns.length >= 6) {
        const question: QuizQuestion = {
          question: columns[0].trim(),
          options: [columns[1].trim(), columns[2].trim(), columns[3].trim(), columns[4].trim()],
          correctAnswer: Number.parseInt(columns[5].trim()) - 1,
        }
        questions.push(question)
      }
    }

    this.quizQuestions = questions
  }

  initializeQuiz(): void {
    if (this.quizQuestions.length === 0) {
      alert("No quiz questions found. Please contact support.")
      return
    }

    this.currentQuestionIndex = 0
    this.selectedAnswers = new Array(this.quizQuestions.length).fill(undefined)
    this.quizCompleted = false
    this.quizScore = 0
    this.correctAnswers = 0
    this.tabSwitchCount = 0
    this.showTabWarning = false

    this.totalQuizTime = this.quizQuestions.length * 60
    this.timeRemaining = this.totalQuizTime

    this.showQuiz = true
    this.startQuizTimer()
    this.preventTabSwitching()
  }

  startQuizTimer(): void {
    this.quizTimer = interval(1000).subscribe(() => {
      this.timeRemaining--
      if (this.timeRemaining <= 0) {
        this.submitQuiz()
      }
    })
  }

  preventTabSwitching(): void {
    document.addEventListener("contextmenu", this.preventEvent)
    document.addEventListener("keydown", this.preventKeyboardShortcuts)
    window.addEventListener("blur", this.handleWindowBlur)
    window.addEventListener("beforeunload", this.preventPageLeave)
  }

  private preventEvent = (e: Event) => {
    e.preventDefault()
    return false
  }

  private preventKeyboardShortcuts = (e: KeyboardEvent) => {
    if (
      (e.altKey && e.key === "Tab") ||
      (e.ctrlKey && e.key === "Tab") ||
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && e.key === "I") ||
      (e.ctrlKey && e.shiftKey && e.key === "J") ||
      (e.ctrlKey && e.key === "u") ||
      (e.ctrlKey && e.key === "w") ||
      (e.ctrlKey && e.key === "r") ||
      e.key === "F5"
    ) {
      e.preventDefault()
      return false
    }
    return true
  }

  private handleWindowBlur = () => {
    if (this.showQuiz && !this.quizCompleted) {
      this.tabSwitchCount++
      if (this.tabSwitchCount === 1) {
        this.showTabWarning = true
        setTimeout(() => {
          this.showTabWarning = false
        }, 3000)
        window.focus()
      } else if (this.tabSwitchCount > this.maxTabSwitches) {
        alert("⚠️ Quiz auto-submitted due to multiple tab switches!")
        this.submitQuiz()
      }
    }
  }

  private preventPageLeave = (e: BeforeUnloadEvent) => {
    if (this.showQuiz && !this.quizCompleted) {
      e.preventDefault()
      e.returnValue = "Quiz in progress. Are you sure you want to leave?"
      return "Quiz in progress. Are you sure you want to leave?"
    }
    return true
  }

  selectOption(optionIndex: number): void {
    this.selectedAnswers[this.currentQuestionIndex] = optionIndex
  }

  nextQuestion(): void {
    if (this.selectedAnswers[this.currentQuestionIndex] === undefined) {
      return
    }

    if (this.currentQuestionIndex < this.quizQuestions.length - 1) {
      this.currentQuestionIndex++
    } else {
      this.submitQuiz()
    }
  }

  submitQuiz(): void {
    if (this.quizCompleted) {
      return
    }

    if (this.quizTimer) {
      this.quizTimer.unsubscribe()
      this.quizTimer = null
    }

    this.correctAnswers = 0
    for (let i = 0; i < this.quizQuestions.length; i++) {
      if (this.selectedAnswers[i] === this.quizQuestions[i].correctAnswer) {
        this.correctAnswers++
      }
    }

    this.quizScore = Math.round((this.correctAnswers / this.quizQuestions.length) * 100)
    this.quizCompleted = true
    this.quizTaken = true

    this.removeQuizEventListeners()
  }

  
// 5. UPDATE in completeQuiz() method around line 796 (after quiz completion)
completeQuiz(): void {
  if (!this.quizCompleted || this.isSubmittingQuiz) {
    return
  }

  const confirmed = confirm(
    `🎯 Quiz Complete!\n\n` +
      `Your Score: ${this.quizScore}%\n` +
      `Status: ${this.quizScore >= 70 ? "PASSED" : "FAILED"}\n\n` +
      `Click OK to save your results and close the quiz.`,
  )

  if (!confirmed) {
    return
  }

  this.isSubmittingQuiz = true

  const quizRequest = {
    UserId: this.userId,
    CourseId: this.courseId,
    QuizScore: this.quizScore,
  }

  this.subscriptions.add(
    this.assignmentService.completeQuiz(quizRequest).subscribe({
      next: (response: any) => {
        console.log("✅ Quiz results saved successfully:", response)
        
        // UPDATE QUIZ STATUS AND RECALCULATE PROGRESS
        this.quizStatus = 2 // Mark quiz as completed
        this.updateProgress() // This will now use the new calculation
        
        this.closeQuiz()
        this.loadCourseData()
        this.isSubmittingQuiz = false
      },
      error: (error: any) => {
        console.error("❌ Error saving quiz results:", error)
        this.closeQuiz()
        this.isSubmittingQuiz = false
      },
    }),
  )
}

  saveQuizResult(): void {
    const quizResult = {
      userId: this.userId,
      courseId: this.courseId,
      score: this.quizScore,
      correctAnswers: this.correctAnswers,
      totalQuestions: this.quizQuestions.length,
      completedAt: new Date().toISOString(),
    }
  }

  removeQuizEventListeners(): void {
    document.removeEventListener("contextmenu", this.preventEvent)
    document.removeEventListener("keydown", this.preventKeyboardShortcuts)
    window.removeEventListener("blur", this.handleWindowBlur)
    window.removeEventListener("beforeunload", this.preventPageLeave)
  }

  closeQuiz(): void {
    this.showQuiz = false
    this.removeQuizEventListeners()

    this.currentQuestionIndex = 0
    this.selectedAnswers = []
    this.quizCompleted = false
    this.timeRemaining = 0
    this.tabSwitchCount = 0
    this.showTabWarning = false
    this.isSubmittingQuiz = false

    if (this.quizTimer) {
      this.quizTimer.unsubscribe()
      this.quizTimer = null
    }
  }

  retakeQuiz(): void {
    this.quizTaken = false
    this.closeQuiz()
    setTimeout(() => {
      this.startQuiz()
    }, 500)
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  getTimerProgress(): number {
    if (this.totalQuizTime === 0) return 0
    return ((this.totalQuizTime - this.timeRemaining) / this.totalQuizTime) * 100
  }

  // ===== EXISTING METHODS =====
  getModuleIcon(module: ModuleDto): string {
    const hasVideo = module.videoUrl || this.hasVideoForModule(module.moduleId)
    const hasDocument = module.documentPath || module.documentPath

    if (hasVideo && hasDocument) {
      return "fas fa-file-video"
    } else if (hasVideo) {
      return "fas fa-play-circle"
    } else if (hasDocument) {
      return "fas fa-file-pdf"
    }
    return "fas fa-book"
  }

  private hasVideoForModule(moduleId: string): boolean {
    return true
  }

  getModuleStatusIcon(module: ModuleDto): string {
    return module.isCompleted ? "fas fa-check-circle text-success" : "far fa-circle text-muted"
  }

  goBack(): void {
    if (this.showQuiz && !this.quizCompleted) {
      alert("Quiz in progress! Please complete or close the quiz first.")
      return
    }
    this.router.navigate(["/categories"])
  }

  retryLoad(): void {
    this.loadCourseData()
  }

  getModuleDuration(module: ModuleDto): string {
    return (module as any).duration || ""
  }

  isCourseFullyCompleted(): boolean {
    // console.log("Checking course completion status:", this.courseDetail?.modules)
    // console.log(this.dstatus, this.quizStatus)
   if(this.hasAssignment()){
    return this.dstatus === 1 && this.quizStatus === 2; 
  }
  else{
    return  this.quizStatus === 2;
  }
}
}
