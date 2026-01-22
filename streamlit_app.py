import streamlit as st
import datetime
import os
import json
import random
import pandas as pd

# --- PAGE CONFIGURATION ---
st.set_page_config(
    page_title="GAURAV FIT COACH — Pro",
    page_icon="🏋️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- CUSTOM CSS ---
st.markdown("""
<style>
    .stChatInput { border-radius: 12px; }
    .stChatMessage { border-radius: 12px; padding: 1rem; }
    h1, h2, h3 { color: #4f46e5; }
    .card {
        background-color: white;
        padding: 1.5rem;
        border-radius: 0.75rem;
        border: 1px solid #e5e7eb;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        margin-bottom: 1rem;
    }
    .metric-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background-color: #f8fafc;
        border-radius: 8px;
        margin-bottom: 5px;
    }
    .stProgress > div > div > div > div { background-color: #4f46e5; }
    button[kind="secondary"] {
        background-color: #f1f5f9;
        color: #475569;
        border: none;
    }
</style>
""", unsafe_allow_html=True)

# --- DEPENDENCY CHECK ---
try:
    from google import genai
    from google.genai import types
except ImportError:
    st.error("""
    **Missing Dependencies**
    
    Please install the required library:
    ```bash
    pip install google-genai
    ```
    """)
    st.stop()

# --- CONSTANTS & DATA (Ported from TypeScript) ---

EXERCISE_DATABASE = {
    # --- IMPACT / BONE DENSITY ---
    'jump-rope': { 'name': 'Jump Rope / Pogo Hops', 'group': 'Cardio', 'desc': '3 sets x 1 min', 'video': 'https://www.youtube.com/results?search_query=how+to+jump+rope+properly', 'mode': ['Home', 'Gym'], 'pattern': 'Gait' },
    'box-jumps': { 'name': 'Box Jumps', 'group': 'Legs', 'desc': '3 sets x 8 reps', 'video': 'https://www.youtube.com/results?search_query=box+jump+technique', 'mode': ['Gym'], 'pattern': 'Squat' },
    'broad-jumps': { 'name': 'Broad Jumps', 'group': 'Legs', 'desc': '3 sets x 6 reps', 'video': 'https://www.youtube.com/results?search_query=standing+broad+jump+form', 'mode': ['Home', 'Gym'], 'pattern': 'Hinge' },
    'lateral-skater-jumps': { 'name': 'Lateral Skater Jumps', 'group': 'Cardio', 'desc': '3 sets x 30s', 'video': 'https://www.youtube.com/results?search_query=skater+jumps+exercise', 'mode': ['Home', 'Gym'], 'pattern': 'Impact' },
    'med-ball-slam': { 'name': 'Medicine Ball Slams', 'group': 'Power', 'desc': '3 sets x 10 reps', 'video': 'https://www.youtube.com/results?search_query=medicine+ball+slams', 'mode': ['Gym'], 'pattern': 'Power' },
    'heel-drops': { 'name': 'Heel Drops', 'group': 'Bone Density', 'desc': '3 sets x 20 reps', 'video': 'https://www.youtube.com/results?search_query=heel+drops+for+osteoporosis', 'mode': ['Home', 'Gym'], 'pattern': 'Impact' },
    
    # --- AXIAL LOADING (Spine Compression) ---
    'trap-bar-deadlift': { 'name': 'Trap Bar Deadlift', 'group': 'Legs/Back', 'desc': '3 sets x 6-8 reps', 'video': 'https://www.youtube.com/results?search_query=trap+bar+deadlift+form', 'mode': ['Gym'], 'pattern': 'Hinge' },
    'front-squat': { 'name': 'Front Squat', 'group': 'Legs', 'desc': '3 sets x 8 reps', 'video': 'https://www.youtube.com/results?search_query=front+squat+form', 'mode': ['Gym'], 'pattern': 'Squat' },
    'zercher-squat': { 'name': 'Zercher Squat', 'group': 'Legs/Core', 'desc': '3 sets x 8 reps', 'video': 'https://www.youtube.com/results?search_query=zercher+squat+form', 'mode': ['Gym'], 'pattern': 'Squat' },
    'weighted-step-ups': { 'name': 'Weighted Step-Ups', 'group': 'Legs', 'desc': '3 sets x 10/leg', 'video': 'https://www.youtube.com/results?search_query=weighted+step+up+form', 'mode': ['Home', 'Gym'], 'pattern': 'Lunge' },
    'rucking': { 'name': 'Rucking (Weighted Walk)', 'group': 'Back/Legs', 'desc': '20-30 min walk', 'video': 'https://www.youtube.com/results?search_query=how+to+ruck+properly', 'mode': ['Home', 'Gym'], 'pattern': 'Gait' },

    # --- PUSH ---
    'pushups': { 'name': 'Standard Push-Up', 'group': 'Chest', 'desc': '3 sets x 15 reps', 'video': 'https://www.youtube.com/results?search_query=perfect+pushup+form', 'mode': ['Home'], 'pattern': 'Push' },
    'pike-pushups': { 'name': 'Pike Push-Up', 'group': 'Shoulders', 'desc': '3 sets x 10 reps', 'video': 'https://www.youtube.com/results?search_query=pike+pushup+progression', 'mode': ['Home'], 'pattern': 'Push' },
    'chair-dips': { 'name': 'Tricep Chair Dips', 'group': 'Triceps', 'desc': '3 sets x 15 reps', 'video': 'https://www.youtube.com/results?search_query=how+to+do+chair+dips', 'mode': ['Home'], 'pattern': 'Push' },
    'bench-press': { 'name': 'Barbell Bench Press', 'group': 'Chest', 'desc': '3 sets x 8-10 reps', 'video': 'https://www.youtube.com/results?search_query=bench+press+form', 'mode': ['Gym'], 'pattern': 'Push' },
    'overhead-press': { 'name': 'Overhead Press', 'group': 'Shoulders', 'desc': '3 sets x 10 reps', 'video': 'https://www.youtube.com/results?search_query=overhead+press+form', 'mode': ['Gym', 'Home'], 'pattern': 'Push' },
    'landmine-press': { 'name': 'Landmine Press', 'group': 'Shoulders', 'desc': '3 sets x 10/arm', 'video': 'https://www.youtube.com/results?search_query=landmine+press+form', 'mode': ['Gym'], 'pattern': 'Push' },

    # --- PULL ---
    'pullups': { 'name': 'Pull-Ups', 'group': 'Back', 'desc': '3 sets x Max reps', 'video': 'https://www.youtube.com/results?search_query=how+to+do+pullups', 'mode': ['Home', 'Gym'], 'pattern': 'Pull' },
    'dumbbell-row': { 'name': 'Dumbbell Row', 'group': 'Back', 'desc': '3 sets x 12 reps', 'video': 'https://www.youtube.com/results?search_query=dumbbell+row+form', 'mode': ['Home', 'Gym'], 'pattern': 'Pull' },
    'lat-pulldown': { 'name': 'Lat Pulldown', 'group': 'Back', 'desc': '3 sets x 12 reps', 'video': 'https://www.youtube.com/results?search_query=lat+pulldown+form', 'mode': ['Gym'], 'pattern': 'Pull' },
    'cable-row': { 'name': 'Seated Cable Row', 'group': 'Back', 'desc': '3 sets x 12 reps', 'video': 'https://www.youtube.com/results?search_query=seated+cable+row+form', 'mode': ['Gym'], 'pattern': 'Pull' },
    'face-pulls': { 'name': 'Face Pulls', 'group': 'Shoulders', 'desc': '3 sets x 15 reps', 'video': 'https://www.youtube.com/results?search_query=face+pull+exercise', 'mode': ['Gym', 'Home'], 'pattern': 'Pull' },

    # --- LEGS (Squat/Lunge) ---
    'goblet-squat': { 'name': 'Goblet Squat', 'group': 'Legs', 'desc': '4 sets x 12 reps', 'video': 'https://www.youtube.com/results?search_query=goblet+squat+form', 'mode': ['Home', 'Gym'], 'pattern': 'Squat' },
    'bulgarian-split-squat': { 'name': 'Bulgarian Split Squat', 'group': 'Legs', 'desc': '3 sets x 8/leg', 'video': 'https://www.youtube.com/results?search_query=bulgarian+split+squat+form', 'mode': ['Home', 'Gym'], 'pattern': 'Lunge' },
    'walking-lunges': { 'name': 'Walking Lunges', 'group': 'Legs', 'desc': '3 sets x 20 steps', 'video': 'https://www.youtube.com/results?search_query=walking+lunges+form', 'mode': ['Home', 'Gym'], 'pattern': 'Lunge' },
    
    # --- HINGE / HAMSTRINGS ---
    'rdl': { 'name': 'Romanian Deadlift', 'group': 'Legs', 'desc': '3 sets x 10 reps', 'video': 'https://www.youtube.com/results?search_query=rdl+form', 'mode': ['Home', 'Gym'], 'pattern': 'Hinge' },
    'single-leg-rdl': { 'name': 'Single Leg RDL', 'group': 'Hamstrings', 'desc': '3 sets x 8/leg', 'video': 'https://www.youtube.com/results?search_query=single+leg+rdl+form', 'mode': ['Home', 'Gym'], 'pattern': 'Hinge' },
    'kettlebell-swing': { 'name': 'Kettlebell Swing', 'group': 'Hinge', 'desc': '3 sets x 15 reps', 'video': 'https://www.youtube.com/results?search_query=kettlebell+swing+form', 'mode': ['Home', 'Gym'], 'pattern': 'Hinge' },

    # --- CORE / CARRY ---
    'plank': { 'name': 'Plank', 'group': 'Core', 'desc': '3 sets x 60s', 'video': 'https://www.youtube.com/results?search_query=perfect+plank+form', 'mode': ['Home', 'Gym'], 'pattern': 'Core' },
    'dead-bug': { 'name': 'Dead Bug', 'group': 'Core', 'desc': '3 sets x 12 reps', 'video': 'https://www.youtube.com/results?search_query=dead+bug+exercise', 'mode': ['Home', 'Gym'], 'pattern': 'Core' },
    'farmer-carry': { 'name': 'Farmer Carry', 'group': 'Core/Grip', 'desc': '3 sets x 45s', 'video': 'https://www.youtube.com/results?search_query=farmer+carry+form', 'mode': ['Home', 'Gym'], 'pattern': 'Gait' },
    'suitcase-carry': { 'name': 'Suitcase Carry', 'group': 'Core', 'desc': '3 sets x 30s/side', 'video': 'https://www.youtube.com/results?search_query=suitcase+carry+form', 'mode': ['Home', 'Gym'], 'pattern': 'Gait' },
    
    # --- SPECIALIZED ---
    'cat-cow': { 'name': 'Cat-Cow Stretch', 'group': 'Mobility', 'desc': '1 min flow', 'video': 'https://www.youtube.com/results?search_query=cat+cow+stretch', 'mode': ['Home', 'Gym'], 'pattern': 'Mobility' },
    'kegel-basic': { 'name': 'Kegel Hold', 'group': 'Pelvic Floor', 'desc': '3 sets x 10 reps (3s hold)', 'video': 'https://www.youtube.com/results?search_query=kegel+exercises+for+men', 'mode': ['Home'], 'pattern': 'Isolation' },
    'chin-tuck': { 'name': 'Chin Tucks', 'group': 'Posture', 'desc': '20 reps', 'video': 'https://www.youtube.com/results?search_query=chin+tucks+for+posture', 'mode': ['Home'], 'pattern': 'Mobility' },
    'tibialis-raise': { 'name': 'Tibialis Raise', 'group': 'Legs', 'desc': '3 sets x 20 reps', 'video': 'https://www.youtube.com/results?search_query=tibialis+raise+at+home', 'mode': ['Home', 'Gym'], 'pattern': 'Isolation' }
}

MEAL_TEMPLATES = {
    'Non-veg': {
        'Breakfast': {'name': "Eggs & Toast", 'cals': 500, 'pro': 25, 'ingredients': ["3 Eggs", "2 Brown Bread", "Butter"]},
        'Lunch': {'name': "Chicken Curry & Rice", 'cals': 700, 'pro': 40, 'ingredients': ["Chicken Breast 150g", "Rice 1 cup", "Veg Salad"]},
        'Snack': {'name': "Protein Shake & Fruit", 'cals': 250, 'pro': 25, 'ingredients': ["Whey Scoop", "Apple"]},
        'Dinner': {'name': "Fish/Chicken & Veggies", 'cals': 500, 'pro': 35, 'ingredients': ["Fish/Chicken 150g", "Mixed Veggies", "1 Roti"]}
    },
    'Veg': {
        'Breakfast': {'name': "Paneer Sandwich / Sprouts", 'cals': 450, 'pro': 20, 'ingredients': ["Paneer 100g", "Bread", "Sprouts"]},
        'Lunch': {'name': "Dal, Paneer & Rice", 'cals': 700, 'pro': 25, 'ingredients': ["Dal 1 bowl", "Paneer 100g", "Rice"]},
        'Snack': {'name': "Greek Yogurt / Whey", 'cals': 250, 'pro': 25, 'ingredients': ["Yogurt/Whey", "Berries"]},
        'Dinner': {'name': "Soya Chunks Stir Fry", 'cals': 450, 'pro': 30, 'ingredients': ["Soya Chunks 50g", "Veggies", "Olive Oil"]}
    }
}

WEEKLY_SPLIT = {
  "Monday": "Upper Body Strength (Push Focus) + Bone Loading",
  "Tuesday": "Lower Body (Squat/Lunge) + Tibialis Work",
  "Wednesday": "Active Recovery (Yoga + Core + Mobility)",
  "Thursday": "Upper Body Strength (Pull Focus) + Posture",
  "Friday": "Full Body Functional + High Impact (Bone density)",
  "Saturday": "Cardio Zone 2 + Deep Stretch",
  "Sunday": "Rest + Meal Prep + Mental Reset",
}

DIET_GUIDELINES = {'calories': 2300, 'protein': 120, 'water': 3.5, 'steps': 9000}

# --- STATE MANAGEMENT ---
if 'user_profile' not in st.session_state:
    st.session_state.user_profile = {
        'name': 'Gaurav', 'weight': 60.0, 'height': "5'7\"", 'diet': 'Non-veg', 
        'workout_mode': 'Home', 'level': 'Intermediate', 'injuries': [], 'kegel_level': 1
    }

if 'daily_log' not in st.session_state:
    st.session_state.daily_log = {'protein': 0, 'water': 0.0, 'steps': 0, 'completed_tasks': set(), 'soreness': 0}

if 'history' not in st.session_state:
    # Generate some demo history
    today = datetime.date.today()
    st.session_state.history = []
    for i in range(5, 0, -1):
        d = today - datetime.timedelta(days=i)
        st.session_state.history.append({
            'date': d.isoformat(),
            'weight': 60 + (i * 0.1),
            'tasks': random.randint(10, 15)
        })

# --- API KEY MANAGEMENT ---
api_key = os.environ.get("API_KEY")
if not api_key:
    try:
        api_key = st.secrets.get("GEMINI_API_KEY")
    except FileNotFoundError:
        pass

if not api_key:
    with st.sidebar:
        st.header("🔑 Authentication")
        st.info("To access the AI Coach, you need a Google Gemini API Key.")
        user_key = st.text_input("Enter API Key", type="password")
        if user_key:
            api_key = user_key
            st.success("Key accepted!")
            st.rerun()
        else:
            st.markdown("[Get a Key](https://aistudio.google.com/app/apikey)")
            st.warning("Coach features disabled.")

# --- HELPER FUNCTIONS ---

def get_daily_plan_logic(date_obj, user_mode):
    """Generates the workout plan based on the day and user mode (Home/Gym)."""
    day_name = date_obj.strftime('%A')
    
    # Base Routines
    morning = ['cat-cow', 'kegel-basic', 'chin-tuck']
    evening = ['cat-cow']
    workout = []

    # Logic ported from utils/planGenerator.ts
    if day_name == 'Monday': # Push
        if user_mode == 'Gym':
            workout = ['bench-press', 'overhead-press', 'chair-dips', 'plank', 'farmer-carry']
        else:
            workout = ['pushups', 'pike-pushups', 'chair-dips', 'plank', 'farmer-carry']
            
    elif day_name == 'Tuesday': # Legs
        if user_mode == 'Gym':
            workout = ['front-squat', 'rdl', 'weighted-step-ups', 'tibialis-raise']
        else:
            workout = ['goblet-squat', 'rdl', 'weighted-step-ups', 'tibialis-raise']
            
    elif day_name == 'Wednesday': # Recovery
        workout = ['cat-cow', 'kegel-basic', 'dead-bug']
        
    elif day_name == 'Thursday': # Pull
        if user_mode == 'Gym':
            workout = ['lat-pulldown', 'cable-row', 'face-pulls', 'trap-bar-deadlift']
        else:
            workout = ['pullups', 'dumbbell-row', 'chin-tuck', 'rucking']
            
    elif day_name == 'Friday': # Impact
        if user_mode == 'Gym':
            workout = ['box-jumps', 'trap-bar-deadlift', 'jump-rope']
        else:
            workout = ['broad-jumps', 'pushups', 'jump-rope']
            
    elif day_name == 'Saturday': # Cardio
        workout = ['jump-rope', 'dead-bug', 'plank']
        
    else: # Sunday
        workout = []

    return morning, workout, evening

def get_exercise_details(ex_id):
    return EXERCISE_DATABASE.get(ex_id, {
        'name': ex_id.replace('-', ' ').title(), 'desc': 'Check description', 'video': '', 'group': 'General', 'pattern': 'General'
    })

def generate_ai_response(prompt, history, mode):
    """Calls Gemini API."""
    if not api_key:
        return "Please provide an API Key to use the coach."
    
    try:
        client = genai.Client(api_key=api_key)
        
        system_instruction = """
        You are Dr. Fit, an expert Sports Medicine Physician, Strength & Conditioning Coach, and Nutritionist.
        You are coaching Gaurav (24M, 60kg, 5'7", Goal: Bone Strength & Lean Muscle).
        Core Knowledge: Wolff's Law (Bone density), Axial Loading, Progressive Overload.
        Be concise, clinical, and encouraging.
        """
        
        if mode == "Expert":
            model_id = "gemini-3-pro-preview"
            system_instruction += "\n\n*** EXPERT MODE ***\nUse deep reasoning to analyze biomechanics and physiology."
            config = types.GenerateContentConfig(
                system_instruction=system_instruction,
                thinking_config=types.ThinkingConfig(include_thoughts=False, thinking_budget=32768)
            )
        else:
            model_id = "gemini-2.5-flash-lite-latest"
            config = types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.7
            )
            
        chat = client.chats.create(model=model_id, config=config, history=history)
        response = chat.send_message(prompt)
        return response.text
    except Exception as e:
        return f"Error: {str(e)}"

# --- UI LAYOUT ---

# Sidebar
with st.sidebar:
    st.title("🏋️ Gaurav Fit Coach")
    st.caption(f"User: {st.session_state.user_profile['name']} | Level: {st.session_state.user_profile['level']}")
    
    st.divider()
    
    menu = st.radio("Navigation", ["Today's Plan", "Weekly Split", "Exercise Library", "Meal Plan", "AI Coach", "Progress", "Settings"])
    
    st.divider()
    
    st.subheader("Daily Targets")
    p_prog = st.session_state.daily_log['protein'] / DIET_GUIDELINES['protein']
    st.progress(min(p_prog, 1.0), text=f"Protein: {st.session_state.daily_log['protein']}/{DIET_GUIDELINES['protein']}g")
    
    w_prog = st.session_state.daily_log['water'] / DIET_GUIDELINES['water']
    st.progress(min(w_prog, 1.0), text=f"Water: {st.session_state.daily_log['water']:.1f}/{DIET_GUIDELINES['water']}L")
    
    s_prog = st.session_state.daily_log['steps'] / DIET_GUIDELINES['steps']
    st.progress(min(s_prog, 1.0), text=f"Steps: {st.session_state.daily_log['steps']}/{DIET_GUIDELINES['steps']}")

# Main Content

if menu == "Today's Plan":
    today = datetime.date.today()
    day_name = today.strftime('%A')
    mode = st.session_state.user_profile['workout_mode']
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.header(f"📅 {day_name}'s Protocol")
        st.caption(f"Focus: {WEEKLY_SPLIT.get(day_name, 'Rest')}")
        
        morning, workout, evening = get_daily_plan_logic(today, mode)
        
        def render_task_list(title, task_ids, section_uid):
            if not task_ids:
                return
            st.subheader(title)
            for i, tid in enumerate(task_ids):
                ex = get_exercise_details(tid)
                is_done = tid in st.session_state.daily_log['completed_tasks']
                
                # Unique key: section_uid + tid + index
                unique_key = f"btn_{section_uid}_{tid}_{i}"
                
                with st.expander(f"{'✅' if is_done else '⬜'} {ex['name']}", expanded=False):
                    st.markdown(f"**Rx:** {ex['desc']}")
                    st.caption(f"Target: {ex['group']} • Pattern: {ex['pattern']}")
                    if ex['video']:
                        st.markdown(f"[▶ Watch Demo]({ex['video']})")
                    
                    if st.button(f"Mark {'Undone' if is_done else 'Complete'}", key=unique_key):
                        if is_done:
                            st.session_state.daily_log['completed_tasks'].remove(tid)
                        else:
                            st.session_state.daily_log['completed_tasks'].add(tid)
                        st.rerun()

        render_task_list("🌅 Morning Routine", morning, "morning")
        
        if workout:
            st.markdown("---")
            render_task_list(f"💪 Main Workout ({mode})", workout, "workout")
        else:
            st.info("Active Recovery Day.")
            
        st.markdown("---")
        render_task_list("🌙 Evening Recovery", evening, "evening")

    with col2:
        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.subheader("📝 Macro Logger")
        
        st.write("**Protein**")
        c1, c2 = st.columns(2)
        if c1.button("+10g"): 
            st.session_state.daily_log['protein'] += 10
            st.rerun()
        if c2.button("+25g"): 
            st.session_state.daily_log['protein'] += 25
            st.rerun()
            
        st.write("**Water**")
        c3, c4 = st.columns(2)
        if c3.button("+250ml"): 
            st.session_state.daily_log['water'] += 0.25
            st.rerun()
        if c4.button("+500ml"): 
            st.session_state.daily_log['water'] += 0.5
            st.rerun()
            
        st.write("**Steps**")
        if st.button("+1000 Steps"):
            st.session_state.daily_log['steps'] += 1000
            st.rerun()
        st.markdown('</div>', unsafe_allow_html=True)
        
        with st.expander("Recovery Check-in"):
            soreness = st.slider("Muscle Soreness (0-10)", 0, 10, st.session_state.daily_log['soreness'])
            if soreness != st.session_state.daily_log['soreness']:
                st.session_state.daily_log['soreness'] = soreness
                st.success("Logged!")

elif menu == "Weekly Split":
    st.header("🗓️ Weekly Training Split")
    st.caption("Periodized for Bone Density & Hypertrophy")
    
    for day, focus in WEEKLY_SPLIT.items():
        with st.container():
            st.markdown(f"**{day}**")
            st.info(focus)

elif menu == "Exercise Library":
    st.header("📚 Exercise Database")
    
    search_term = st.text_input("Search exercises...", "")
    filter_mode = st.selectbox("Filter by Mode", ["All", "Home", "Gym"])
    
    cols = st.columns(2)
    idx = 0
    
    for eid, data in EXERCISE_DATABASE.items():
        # Filtering
        if search_term.lower() not in data['name'].lower() and search_term.lower() not in data['group'].lower():
            continue
        if filter_mode != "All" and filter_mode not in data['mode']:
            continue
            
        with cols[idx % 2]:
            st.markdown(f"""
            <div class="card">
                <h4>{data['name']}</h4>
                <p style="font-size:12px; color:gray;">{data['group']} | {', '.join(data['mode'])}</p>
                <p><b>{data['desc']}</b></p>
                <a href="{data['video']}" target="_blank">▶ Watch Tutorial</a>
            </div>
            """, unsafe_allow_html=True)
        idx += 1

elif menu == "Meal Plan":
    st.header("🍽️ Meal Planner")
    
    diet_type = st.session_state.user_profile['diet']
    st.info(f"Current Preference: **{diet_type}**")
    
    plan = MEAL_TEMPLATES.get(diet_type, MEAL_TEMPLATES['Veg'])
    
    for meal, details in plan.items():
        with st.expander(f"{meal}: {details['name']}", expanded=True):
            col1, col2 = st.columns([3, 1])
            with col1:
                st.write(f"**Ingredients:** {', '.join(details['ingredients'])}")
            with col2:
                st.metric("Calories", details['cals'])
                st.metric("Protein", f"{details['pro']}g")

elif menu == "AI Coach":
    st.header("🤖 Dr. Fit")
    st.caption("Ask about form, pain, or nutrition.")
    
    col_mode, col_clear = st.columns([3,1])
    with col_mode:
        coach_mode = st.radio("Coach Mode", ["Standard", "Expert"], horizontal=True, help="Expert mode uses reasoning (Gemini 2.0 Flash Thinking).")
    with col_clear:
        if st.button("Clear Chat"):
            st.session_state.messages = []
            st.rerun()

    if "messages" not in st.session_state:
        st.session_state.messages = [{"role": "model", "content": "Hello Gaurav! How can I help you reach your goals today?"}]

    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])

    if prompt := st.chat_input("Ask Dr. Fit..."):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        with st.chat_message("model"):
            with st.spinner("Thinking..."):
                # Prepare history
                history_for_api = [
                    types.Content(role=m["role"], parts=[types.Part.from_text(text=m["content"])]) 
                    for m in st.session_state.messages if m["role"] != "system"
                ]
                
                response_text = generate_ai_response(prompt, history_for_api, coach_mode)
                st.markdown(response_text)
                st.session_state.messages.append({"role": "model", "content": response_text})

elif menu == "Progress":
    st.header("📈 Progress Tracker")
    
    # Charts
    if st.session_state.history:
        df = pd.DataFrame(st.session_state.history)
        
        tab1, tab2 = st.tabs(["Weight Trend", "Habit Consistency"])
        
        with tab1:
            st.line_chart(df.set_index('date')['weight'])
        
        with tab2:
            st.bar_chart(df.set_index('date')['tasks'])
            
    # Entry Form
    with st.expander("Log Today's Stats", expanded=True):
        with st.form("log_stats"):
            w = st.number_input("Weight (kg)", value=st.session_state.user_profile['weight'])
            if st.form_submit_button("Save Entry"):
                st.session_state.user_profile['weight'] = w
                st.session_state.history.append({
                    'date': datetime.date.today().isoformat(),
                    'weight': w,
                    'tasks': len(st.session_state.daily_log['completed_tasks'])
                })
                st.success("Saved!")
                st.rerun()
                
    if st.button("Download Data (JSON)"):
        data_str = json.dumps({'user': st.session_state.user_profile, 'history': st.session_state.history})
        st.download_button("Click to Download", data_str, "gaurav_fit_data.json", "application/json")

elif menu == "Settings":
    st.header("⚙️ Settings")
    
    with st.form("settings_form"):
        st.subheader("Profile")
        name = st.text_input("Name", st.session_state.user_profile['name'])
        
        st.subheader("Training Preferences")
        mode = st.selectbox("Workout Mode", ["Home", "Gym"], index=0 if st.session_state.user_profile['workout_mode'] == 'Home' else 1)
        diet = st.selectbox("Diet Type", ["Non-veg", "Veg"], index=0 if st.session_state.user_profile['diet'] == 'Non-veg' else 1)
        
        if st.form_submit_button("Save Settings"):
            st.session_state.user_profile['name'] = name
            st.session_state.user_profile['workout_mode'] = mode
            st.session_state.user_profile['diet'] = diet
            st.success("Settings saved!")
            st.rerun()
            
    st.markdown("---")
    if st.button("⚠️ Reset All Data", type="primary"):
        st.session_state.clear()
        st.rerun()
