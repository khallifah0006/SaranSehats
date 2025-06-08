
const API_BASE_URL = " http://localhost:3000";


async function getRecommendations(userData) {
  const response = await fetch(`${API_BASE_URL}/api/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

async function saveWorkout(workoutData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workoutData)
    });
    
    const responseData = await response.json();
    
    // Handle API errors with proper status codes
    if (!response.ok) {
      // Create error object with server's error message
      const error = new Error(responseData.error || `HTTP error! status: ${response.status}`);
      error.statusCode = response.status;
      throw error;
    }
    
    return responseData;
  } catch (error) {
    // Re-throw the error to be handled by the caller
    throw error;
  }
}

async function getSavedWorkouts() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/saved-workouts`);
    
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
    }
    
    return responseData;
  } catch (error) {
    console.error("Error fetching saved workouts:", error);
    throw error;
  }
}

async function getSavedWorkoutById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/saved-workouts/${id}`);
    
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
    }
    
    return responseData;
  } catch (error) {
    console.error(`Error fetching workout ID ${id}:`, error);
    throw error;
  }
}

// Global variable to store the current recommendation data
let currentRecommendation = null;

// Set up everything when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Add event listeners after DOM is fully loaded
  setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
  // Form submission for workout recommendations
  document.getElementById("recommendForm").addEventListener("submit", handleRecommendFormSubmit);
  
  // Save button click
  document.getElementById("saveBtn").addEventListener("click", handleSaveWorkout);
  
  // Show saved workouts button click
  document.getElementById("showSavedBtn").addEventListener("click", handleShowSavedWorkouts);
}

// Handle form submission for workout recommendations
async function handleRecommendFormSubmit(e) {
  e.preventDefault();
  const resultElement = document.getElementById("result");
  
  // Show the result container and add loading message
  resultElement.style.display = "block";
  resultElement.classList.add("show");
  resultElement.innerHTML = "<p>Memproses rekomendasi...</p>";
  
  try {
    // Collect form data
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());
    
    // Convert string values to numbers
    payload.age = parseInt(payload.age);
    payload.height = parseFloat(payload.height);
    payload.weight = parseFloat(payload.weight);
    
    console.log("Sending payload:", payload); // Debug log
    
    // Get recommendations from API
    const response = await getRecommendations(payload);
    console.log("API Response:", response); // Debug log
    
    if (response.success) {
      // Store the current recommendation data globally
      currentRecommendation = response.data;
      
      // Enable the save button
      const saveBtn = document.getElementById("saveBtn");
      if (saveBtn) {
        saveBtn.disabled = false;
      }
      
      // Display the recommendation results
      displayRecommendationResults(response.data);
    } else {
      resultElement.innerHTML = `<p style="color:red;">❌ ${response.error}</p>`;
    }
  } catch (error) {
    console.error("Error getting recommendations:", error);
    resultElement.innerHTML = `<p style="color:red;">❌ Terjadi kesalahan saat memanggil API: ${error.message}</p>`;
  }
}


function displayRecommendationResults(data) {
  console.log("Displaying results:", data); // Debug log
  
  const { bmi, bmi_category, age_category, recommended_workouts } = data;
  
  // Mapping workout names to their corresponding HTML files
  const workoutLinks = {
    'swimming': 'berenang.html',
    'berenang': 'berenang.html',
    'cycling': 'bersepeda.html',
    'bersepeda': 'bersepeda.html',
    'weightlifting': 'weightlifting.html',
    'weight lifting': 'weightlifting.html',
    'angkat beban': 'weightlifting.html',
    'walking': 'berjalan.html',
    'berjalan': 'berjalan.html',
    'jalan kaki': 'berjalan.html',
    'hiit': 'hiit.html',
    'high intensity interval training': 'hiit.html',
    'cardio': 'kardio.html',
    'kardio': 'kardio.html',
    'aerobics': 'senam.html',
    'senam': 'senam.html',
    'gymnastics': 'senam.html',
    'yoga': 'yoga.html',
    'pilates': 'yoga.html'
  };
  
  let output = `<h3>📊 Hasil Rekomendasi:</h3>`;
  output += `<p><strong>BMI:</strong> ${bmi || 'N/A'} ${bmi_category ? `(${bmi_category})` : ''}</p>`;
  output += `<p><strong>Kategori Umur:</strong> ${age_category || 'N/A'}</p>`;
  output += `<h4>Rekomendasi Latihan:</h4>`;
  
  if (recommended_workouts && Array.isArray(recommended_workouts) && recommended_workouts.length > 0) {
    output += `<ul>`;
    recommended_workouts.forEach((workout, index) => {
      // Safety check for workout object
      if (!workout || typeof workout !== 'object') {
        console.warn("Invalid workout object:", workout);
        return;
      }
      
      const workoutName = workout.name || 'Unknown Workout';
      const confidence = workout.confidence || 0;
      const workoutNameLower = workoutName.toLowerCase();
      
      console.log(`Processing workout ${index + 1}: "${workoutName}" (lowercase: "${workoutNameLower}")`); // Debug log
      
      // Find matching link - improved matching logic
      let matchedLink = null;
      let htmlFile = null;
      
      // First, try exact match
      if (workoutLinks[workoutNameLower]) {
        matchedLink = workoutNameLower;
        htmlFile = workoutLinks[workoutNameLower];
      } else {
        // Then try partial matching - check if workout name contains any key
        matchedLink = Object.keys(workoutLinks).find(key => {
          const keyMatch = workoutNameLower.includes(key);
          const valueMatch = key.includes(workoutNameLower);
          console.log(`  Checking "${key}" against "${workoutNameLower}": includes=${keyMatch}, reverse=${valueMatch}`);
          return keyMatch || valueMatch;
        });
        
        if (matchedLink) {
          htmlFile = workoutLinks[matchedLink];
        }
      }
      
      console.log(`  Match result: ${matchedLink ? `"${matchedLink}" -> "${htmlFile}"` : 'No match found'}`);
      
      if (matchedLink && htmlFile) {
        output += `<li>
          <strong>${workoutName}</strong> (${(confidence * 100).toFixed(1)}%) 
          - <a href="${htmlFile}" target="_blank" style="color: #3b82f6; text-decoration: none; font-weight: 500;">Lihat Gerakan →</a>
        </li>`;
      } else {
        // Fallback - try some common variations
        let fallbackFile = null;
        
        // Check for common workout type patterns
        if (workoutNameLower.includes('swim') || workoutNameLower.includes('renang')) {
          fallbackFile = 'berenang.html';
        } else if (workoutNameLower.includes('cycle') || workoutNameLower.includes('sepeda') || workoutNameLower.includes('bike')) {
          fallbackFile = 'bersepeda.html';
        } else if (workoutNameLower.includes('weight') || workoutNameLower.includes('lifting') || workoutNameLower.includes('beban')) {
          fallbackFile = 'weightlifting.html';
        } else if (workoutNameLower.includes('walk') || workoutNameLower.includes('jalan')) {
          fallbackFile = 'berjalan.html';
        } else if (workoutNameLower.includes('cardio') || workoutNameLower.includes('kardio')) {
          fallbackFile = 'kardio.html';
        } else if (workoutNameLower.includes('yoga')) {
          fallbackFile = 'yoga.html';
        } else if (workoutNameLower.includes('aerobic') || workoutNameLower.includes('senam')) {
          fallbackFile = 'senam.html';
        }
        
        if (fallbackFile) {
          console.log(`  Fallback match: "${workoutName}" -> "${fallbackFile}"`);
          output += `<li>
            <strong>${workoutName}</strong> (${(confidence * 100).toFixed(1)}%) 
            - <a href="${fallbackFile}" target="_blank" style="color: #3b82f6; text-decoration: none; font-weight: 500;">Lihat Gerakan →</a>
          </li>`;
        } else {
          console.log(`  No match found for: "${workoutName}"`);
          output += `<li>
            <strong>${workoutName}</strong> (${(confidence * 100).toFixed(1)}%) 
            - <span style="color: #6b7280; font-style: italic;">Gerakan tidak tersedia</span>
          </li>`;
        }
      }
    });
    output += `</ul>`;
    
    // Add general navigation section
    output += `
      <div style="margin-top: 1.5rem; padding: 1rem; background-color: #f0f9ff; border-radius: 0.5rem; border-left: 4px solid #3b82f6;">
        <h4 style="color: #1e40af; margin-bottom: 0.5rem;">💡 Jelajahi Gerakan Lainnya:</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          <a href="berenang.html" style="color: #3b82f6; text-decoration: none; padding: 0.25rem 0.5rem; background: white; border-radius: 0.25rem; font-size: 0.875rem;">Berenang</a>
          <a href="bersepeda.html" style="color: #3b82f6; text-decoration: none; padding: 0.25rem 0.5rem; background: white; border-radius: 0.25rem; font-size: 0.875rem;">Bersepeda</a>
          <a href="weightlifting.html" style="color: #3b82f6; text-decoration: none; padding: 0.25rem 0.5rem; background: white; border-radius: 0.25rem; font-size: 0.875rem;">Weightlifting</a>
          <a href="berjalan.html" style="color: #3b82f6; text-decoration: none; padding: 0.25rem 0.5rem; background: white; border-radius: 0.25rem; font-size: 0.875rem;">Berjalan</a>
          <a href="hiit.html" style="color: #3b82f6; text-decoration: none; padding: 0.25rem 0.5rem; background: white; border-radius: 0.25rem; font-size: 0.875rem;">HIIT</a>
          <a href="kardio.html" style="color: #3b82f6; text-decoration: none; padding: 0.25rem 0.5rem; background: white; border-radius: 0.25rem; font-size: 0.875rem;">Kardio</a>
          <a href="senam.html" style="color: #3b82f6; text-decoration: none; padding: 0.25rem 0.5rem; background: white; border-radius: 0.25rem; font-size: 0.875rem;">Senam</a>
          <a href="yoga.html" style="color: #3b82f6; text-decoration: none; padding: 0.25rem 0.5rem; background: white; border-radius: 0.25rem; font-size: 0.875rem;">Yoga</a>
        </div>
      </div>`;
  } else {
    output += `<p style="color: #ef4444; font-style: italic;">Tidak ada rekomendasi workout yang tersedia. Silakan coba lagi dengan data yang berbeda.</p>`;
  }
  
  const resultElement = document.getElementById("result");
  if (resultElement) {
    resultElement.innerHTML = output;
    resultElement.style.display = "block";
    resultElement.classList.add("show");
  } else {
    console.error("Result element not found!");
  }
}

async function handleSaveWorkout() {
  if (!currentRecommendation) {
    showNotification("error", "Tidak ada rekomendasi untuk disimpan. Silakan buat rekomendasi terlebih dahulu.");
    return;
  }

  const saveBtn = document.getElementById("saveBtn");
  const originalBtnText = saveBtn.textContent;
  
  try {
    // Disable button and show loading state
    saveBtn.disabled = true;
    saveBtn.textContent = "Simpan";
    
    const response = await saveWorkout(currentRecommendation);
    
    if (response.success) {
      showNotification("success", "Data latihan berhasil disimpan!");
    }
  } catch (error) {
    saveBtn.disabled = false; // Re-enable the button on error
    
   
  } finally {
    // Restore button text
    saveBtn.textContent = originalBtnText;
  }
}

// Helper function to show notifications (can be customized)
function showNotification(type, message) {
  // Simple alert for now, could be replaced with a custom UI notification
  alert(message);
  
  // You can extend this to show different styles based on type:
  // - success: Green notification
  // - error: Red notification
  // - warning: Yellow notification
  // - info: Blue notification
}

// Handle show saved workouts button click
async function handleShowSavedWorkouts() {
  const savedWorkoutsListElement = document.getElementById("savedWorkoutsList");
  savedWorkoutsListElement.innerHTML = "<p>Memuat riwayat latihan...</p>";
  
  try {
    // Get all saved workouts
    const response = await getSavedWorkouts();
    
    if (response.success && response.data.length > 0) {
      // Display saved workouts
      let output = "";
      response.data.forEach(workout => {
        const date = new Date(workout.timestamp).toLocaleString();
        output += `
          <div class="saved-workout">
            <p><strong>Tanggal:</strong> ${date}</p>
            <p><strong>Umur:</strong> ${workout.age}, <strong>Jenis Kelamin:</strong> ${workout.gender === "Male" ? "Laki-laki" : "Perempuan"}</p>
            <p><strong>Tinggi/Berat:</strong> ${workout.height}cm / ${workout.weight}kg</p>
            <p><strong>BMI:</strong> ${workout.bmi} (${workout.bmi_category})</p>
            <h4>Rekomendasi Latihan:</h4>
            <ul>`;
        
        // Show all recommended workouts, not just the first one
        workout.recommended_workouts.forEach(rec => {
          output += `<li>${rec.name} (${(rec.confidence * 100).toFixed(1)}%)</li>`;
        });
        
        output += `</ul>
          </div>
        `;
      });
      savedWorkoutsListElement.innerHTML = output;
    } else {
      savedWorkoutsListElement.innerHTML = "<p>Belum ada riwayat latihan yang tersimpan.</p>";
    }
  } catch (error) {
    savedWorkoutsListElement.innerHTML = "<p>Gagal memuat riwayat latihan.</p>";
    console.error("Error loading saved workouts:", error);
  }
}