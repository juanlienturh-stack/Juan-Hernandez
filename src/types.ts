export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  goal?: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'looksmaxing';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

export interface BodyScan {
  id: string;
  date: string;
  fatPercentage: number;
  musclePercentage: number;
  waterPercentage: number;
  measurements: {
    chest: number;
    waist: number;
    hip: number;
    thigh: number;
    arm: number;
  };
  whr: number;
  posturalAnalysis: string;
  muscleHeatMap: string[]; // List of muscle groups with high development
}

export interface FaceScan {
  id: string;
  date: string;
  symmetryScore: number;
  perceivedAge: number;
  skinHealth: {
    imperfections: string[];
    tone: string;
    tonicity: string;
  };
  skincareRoutine: {
    morning: string[];
    night: string[];
  };
  faceShape: string;
  recommendedHaircuts: string[];
}

export interface FoodEntry {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface Exercise {
  id: string;
  name: string;
  group: string;
  focus: string;
  description: string;
  videoUrl?: string;
}

export interface Routine {
  id: string;
  name: string;
  exercises: {
    exerciseId: string;
    sets: number;
    reps: number;
    rest: number;
  }[];
}

export interface DailyStats {
  date: string;
  steps: number;
  caloriesBurned: number;
  distance: number;
}
