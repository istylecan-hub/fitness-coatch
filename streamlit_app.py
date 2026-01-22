import streamlit as st
import os
import datetime
import json
import random

# --- CONFIGURATION ---
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
    .metric-value { font-size: 1.5rem; font-weight: 700; color: #111827; }
    .metric-label { font-size: 0.875rem; color: #6b7280; }
    .stProgress > div > div > div > div { background-color: #4f46e5; }
    div[data-testid="stExpander"] { border: 1px solid #e5e7eb; border-radius: 0.5rem; }
</style>
""", unsafe_allow_html=True)

# --- DEPENDENCY CHECK ---
try:
    from google import genai
    from google.genai import types
except ImportError:
    st.error("**Missing Dependencies**: Please install `google-genai`.")
    st.stop()

# --- DATA STRUCTURES (Ported from TypeScript) ---

EXERCISE_DATABASE = {
  'jump-rope': { 'name': 'Jump Rope / Pogo Hops', 'group': 'Cardio', 'desc': '3 sets x 1 min', 'video': 'https://www.youtube.com/results?search_query=how+to+jump+rope+properly' },
  'box-jumps': { 'name': 'Box Jumps', 'group': 'Legs', 'desc': '3 sets x 8 reps', 'video': 'https://www.youtube.com/results?search_query=box+jump+technique' },
  'trap-bar-deadlift': { 'name': 'Trap Bar Deadlift', 'group': 'Legs/Back', 'desc': '3 sets x 6-8 reps', 'video': 'https://www.youtube.com/results?search_query=trap+bar+deadlift+form' },
  'pushups': { 'name': 'Standard Push-Up', 'group': 'Chest', 'desc': '3 sets x 15 reps', 'video': 'https://www.youtube.com/results?search_query=perfect+pushup+form' },
  'pullups': { 'name': 'Pull-Ups', 'group': 'Back', 'desc': '3 sets x Max reps', 'video': 'https://www.youtube.com/results?search_query=how+to+do+pullups' },
  'goblet-squat': { 'name': 'Goblet Squat', 'group': 'Legs', 'desc': '4 sets x 12 reps', 'video': 'https://www.youtube.com/results?search_query=goblet+squat+form' },
  'plank': { 'name': 'Plank', 'group': 'Core', 'desc': '3 sets x 60s', 'video': 'https://www.youtube.com/results?search_query=perfect+plank+form' },
  'face-pulls': { 'name': 'Face Pulls', 'group': 'Shoulders', 'desc': '3 sets x 15 reps', 'video': 'https://www.youtube.com/results?search_query=face+pull+exercise' },
  'cat-cow': { 'name': 'Cat-Cow Stretch', 'group': 'Mobility', 'desc': '1 min flow', 'video': 'https://www.youtube.com/results?search_query=cat+cow+stretch' },
  'kegel-basic': { 'name': 'Kegel Hold', 'group': 'Pelvic Floor', 'desc': '3 sets x 10 reps (3s hold)', 'video': 'https://www.youtube.com/results?search_query=kegel+exercises+for+men' },
  'chin-tuck': { 'name': 'Chin Tucks', 'group': 'Posture', 'desc': '20 reps', 'video': 'https://www.youtube.com/results?search_query=chin+tucks+for+posture' },
  'rdl': { 'name': 'Romanian Deadlift', 'group': 'Legs', 'desc': '3 sets x 10 reps', 'video': 'https://www.youtube.com/results?search_query=rdl+form' },
  'overhead-press': { 'name': 'Overhead Press', 'group': 'Shoulders', 'desc': '3 sets x 10 reps', 'video': 'https://www.youtube.com/results?search_query=overhead+press+form' },
  'dumbbell-row': { 'name': 'Dumbbell Row', 'group': 'Back', 'desc': '3 sets x 12 reps', 'video': 'https://www.youtube.com/results?search_query=dumbbell+row+form' },
  'farmer-carry': { 'name': 'Farmer Carry', 'group': 'Core/Grip', 'desc': '3 sets x 45s', 'video': 'https://www.youtube.com/results?search_query=farmer+carry+form' },
  'dead-bug': { 'name': 'Dead Bug', 'group': 'Core', 'desc': '3 sets x 12 reps', 'video': 'https://www.youtube.com/results?search_query=dead+bug+exercise' },
  'tibialis-raise': { 'name': 'Tibialis Raise', 'group': 'Legs', 'desc': '3 sets x 20 reps', 'video': 'https://www.youtube.com/results?search_query=tibialis+raise+at+home' }
}

MEAL_PLANS = {
    'Non-veg': {
        'Breakfast': {'name': "Eggs & Toast", 'cals': 500, 'pro': 25},
        'Lunch': {'name': "Chicken Curry & Rice", 'cals': 700, 'pro': 40},
        'Snack': {'name': "Protein Shake & Fruit", 'cals': 250, 'pro': 25},
        'Dinner': {'name': "Fish/Chicken & Veggies", 'cals': 500, 'pro': 35}
    },
    'Veg': {
        'Breakfast': {'name': "Paneer Sandwich / Sprouts", 'cals': 450, 'pro': 20},
        'Lunch': {'name': "Dal, Paneer & Rice", 'cals': 700, 'pro': 25},
        'Snack': {'name': "Greek Yogurt / Whey", 'cals': 250, 'pro': 25},
        'Dinner': {'name': "Soya Chunks Stir Fry", 'cals': 450, 'pro': 30}
    }
}

# --- STATE MANAGEMENT ---
if 'user_profile' not in st.session_state:
    st.session_state.user_profile = {
        'name': 'Gaurav', 'weight': 60.0, 'height': "5'7\"", 'diet': 'Non-veg', 
        'mode': 'Home', 'level': 'Intermediate', 'injuries': []
    }

if 'daily_log' not in st.session_state:
    st.session_state.daily_log = {'protein': 0, 'water': 0.0, 'steps': 0, 'completed_tasks': set()}

if 'history' not in st.session_state:
    # Demo history
    st.session_state.history = [
        {'date': (datetime.date.today() - datetime.timedelta(days=i)).isoformat(), 'weight': 60 + (i*0.1), 'tasks': 10+i} 
        for i in range(5, 0, -1)
    ]

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
        st.warning("API Key required for Coach.")
        st.markdown("[Get Key](https://aistudio.google.com/app/apikey)")
        user_key = st.text_input("Enter Gemini API Key", type="password")
        if user_key:
            api_key = user_key
            st.rerun()

# --- HELPER FUNCTIONS ---
def get_daily_plan(day_name):
    """Generates a simplified plan based on the day of the week logic from React app."""
    morning = ['cat-cow', 'kegel-basic', 'chin-tuck']
    evening = ['cat-cow']
    
    workout = []
    if day_name == 'Monday': # Push
        workout = ['pushups', 'overhead-press', 'plank', 'farmer-carry']
    elif day_name == 'Tuesday': # Legs
        workout = ['goblet-squat', 'rdl', 'tibialis-raise']
    elif day_name == 'Wednesday': # Active Recovery
        workout = ['cat-cow', 'kegel-basic'] # Light
    elif day_name == 'Thursday': # Pull
        workout = ['pullups', 'dumbbell-row', 'face-pulls']
    elif day_name == 'Friday': # Impact/Full Body
        workout = ['box-jumps', 'trap-bar-deadlift', 'jump-rope']
    elif day_name == 'Saturday': # Cardio
        workout = ['jump-rope', 'dead-bug']
    else: # Sunday
        workout = [] # Rest
        
    return morning, workout, evening

def generate_html_export(plan_data):
    return f"""
    <html><body>
    <h1>Daily Plan: {datetime.date.today()}</h1>
    <ul>{''.join([f'<li>{t}</li>' for t in plan_data])}</ul>
    </body></html>
    """

# --- UI: SIDEBAR ---
with st.sidebar:
    st.title("🏋️ Gaurav Fit Coach")
    st.caption(f"Welcome, {st.session_state.user_profile['name']}")
    
    st.divider()
    
    # Navigation
    selected_tab = st.radio("Navigate", ["Today's Plan", "AI Coach", "Diet Plan", "Exercise Library", "Progress", "Settings"])
    
    st.divider()
    
    # Quick Stats Sidebar
    st.markdown("### 📊 Daily Targets")
    st.progress(st.session_state.daily_log['protein'] / 120, text=f"Protein: {st.session_state.daily_log['protein']}/120g")
    st.progress(min(st.session_state.daily_log['water'] / 3.5, 1.0), text=f"Water: {st.session_state.daily_log['water']:.1f}/3.5L")

# --- MAIN CONTENT ---

# 1. TODAY'S PLAN
if selected_tab == "Today's Plan":
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.header(f"📅 Plan for {datetime.date.today().strftime('%A')}")
        
        day_name = datetime.date.today().strftime('%A')
        morning, workout, evening = get_daily_plan(day_name)
        
        # Helper to render task list
        def render_section(title, task_ids):
            if not task_ids:
                return
            st.subheader(title)
            for tid in task_ids:
                ex = EXERCISE_DATABASE.get(tid, {'name': tid.replace('-', ' ').title(), 'desc': 'Follow instructions'})
                is_done = tid in st.session_state.daily_log['completed_tasks']
                
                # Custom Task UI
                with st.expander(f"{'✅' if is_done else '⬜'} {ex['name']}", expanded=False):
                    st.write(f"**Prescription:** {ex.get('desc')}")
                    st.write(f"**Muscle Group:** {ex.get('group', 'General')}")
                    if ex.get('video'):
                        st.markdown(f"[▶ Watch Demo]({ex['video']})")
                    
                    if st.button(f"Mark {'Undone' if is_done else 'Done'}", key=f"btn_{title}_{tid}"):
                        if is_done:
                            st.session_state.daily_log['completed_tasks'].remove(tid)
                        else:
                            st.session_state.daily_log['completed_tasks'].add(tid)
                        st.rerun()

        render_section("🌅 Morning Routine", morning)
        
        if workout:
            st.markdown("---")
            render_section("💪 Main Workout", workout)
        else:
            st.info("Rest Day! Focus on recovery and light walking.")
            
        st.markdown("---")
        render_section("🌙 Evening Protocol", evening)

    with col2:
        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.subheader("📝 Macro Tracker")
        
        # Protein
        st.write("Protein")
        c1, c2 = st.columns(2)
        if c1.button("+10g"): 
            st.session_state.daily_log['protein'] += 10
            st.rerun()
        if c2.button("+25g"): 
            st.session_state.daily_log['protein'] += 25
            st.rerun()
            
        # Water
        st.write("Water")
        c3, c4 = st.columns(2)
        if c3.button("+250ml"): 
            st.session_state.daily_log['water'] += 0.25
            st.rerun()
        if c4.button("+500ml"): 
            st.session_state.daily_log['water'] += 0.5
            st.rerun()
            
        st.markdown('</div>', unsafe_allow_html=True)
        
        # Export
        if st.button("📥 Export Plan as HTML"):
            all_tasks = morning + workout + evening
            html = generate_html_export(all_tasks)
            st.download_button("Download HTML", html, file_name="daily_plan.html", mime="text/html")

# 2. AI COACH
elif selected_tab == "AI Coach":
    st.header("🤖 Dr. Fit AI")
    st.caption("Expert Sports Medicine & Conditioning Analysis")
    
    if not api_key:
        st.warning("Please enter an API Key in the sidebar to use the coach.")
    else:
        client = genai.Client(api_key=api_key)
        
        # Chat Settings
        with st.expander("⚙️ Coach Configuration"):
            mode = st.radio("Mode", ["Standard (Flash)", "Expert (Thinking)"], horizontal=True)
            
        if "messages" not in st.session_state:
            st.session_state.messages = [{"role": "model", "content": "Hello! I'm Dr. Fit. How's your recovery feeling today?"}]

        for msg in st.session_state.messages:
            with st.chat_message(msg["role"]):
                st.markdown(msg["content"])

        if prompt := st.chat_input("Ask about form, diet, or pain..."):
            st.session_state.messages.append({"role": "user", "content": prompt})
            with st.chat_message("user"):
                st.markdown(prompt)

            with st.chat_message("model"):
                placeholder = st.empty()
                
                # Config
                sys_instruct = "You are Dr. Fit, a sports medicine expert. Be concise and evidence-based."
                if mode == "Expert (Thinking)":
                    model_id = "gemini-3-pro-preview"
                    sys_instruct += " Use deep reasoning for biomechanics."
                    config = types.GenerateContentConfig(
                        system_instruction=sys_instruct,
                        thinking_config=types.ThinkingConfig(include_thoughts=False, thinking_budget=32768)
                    )
                else:
                    model_id = "gemini-2.5-flash-lite-latest"
                    config = types.GenerateContentConfig(system_instruction=sys_instruct, temperature=0.7)

                # History conversion
                history = [types.Content(role=m["role"], parts=[types.Part.from_text(text=m["content"])]) for m in st.session_state.messages[:-1]]
                
                try:
                    chat = client.chats.create(model=model_id, config=config, history=history)
                    response_stream = chat.send_message_stream(prompt)
                    full_response = ""
                    for chunk in response_stream:
                        if chunk.text:
                            full_response += chunk.text
                            placeholder.markdown(full_response + "▌")
                    placeholder.markdown(full_response)
                    st.session_state.messages.append({"role": "model", "content": full_response})
                except Exception as e:
                    st.error(f"Error: {str(e)}")

# 3. DIET PLAN
elif selected_tab == "Diet Plan":
    st.header("🍽️ Meal Planner")
    
    diet_type = st.session_state.user_profile['diet']
    st.info(f"Current Preference: **{diet_type}**")
    
    plan = MEAL_PLANS.get(diet_type, MEAL_PLANS['Veg'])
    
    col1, col2 = st.columns(2)
    with col1:
        st.subheader("Day's Menu")
        for meal_name, details in plan.items():
            with st.container():
                st.markdown(f"**{meal_name}**")
                st.markdown(f"_{details['name']}_")
                st.caption(f"🔥 {details['cals']} kcal | 🥩 {details['pro']}g Protein")
                st.markdown("---")
                
    with col2:
        st.subheader("🛒 Quick Grocery List")
        st.checkbox("Eggs / Paneer")
        st.checkbox("Chicken Breast / Soya Chunks")
        st.checkbox("Whey Protein")
        st.checkbox("Seasonal Vegetables")
        st.checkbox("Rice / Oats")

# 4. EXERCISE LIBRARY
elif selected_tab == "Exercise Library":
    st.header("📚 Exercise Database")
    
    search = st.text_input("Search exercises...", "")
    
    cols = st.columns(3)
    idx = 0
    for eid, data in EXERCISE_DATABASE.items():
        if search.lower() in data['name'].lower() or search.lower() in data['group'].lower():
            with cols[idx % 3]:
                st.markdown(f"""
                <div class="card">
                    <h4>{data['name']}</h4>
                    <p style="color:gray; font-size:12px">{data['group']}</p>
                    <p><b>{data['desc']}</b></p>
                    <a href="{data['video']}" target="_blank" style="text-decoration:none; color:#4f46e5; font-weight:bold;">▶ Watch Demo</a>
                </div>
                """, unsafe_allow_html=True)
                idx += 1

# 5. PROGRESS
elif selected_tab == "Progress":
    st.header("📈 Progress Tracker")
    
    # Weight Chart
    st.subheader("Weight History")
    history_data = st.session_state.history
    dates = [h['date'] for h in history_data]
    weights = [h['weight'] for h in history_data]
    
    chart_data = {"Date": dates, "Weight (kg)": weights}
    st.line_chart(chart_data, x="Date", y="Weight (kg)")
    
    # Log Entry
    st.subheader("Update Stats")
    with st.form("log_weight"):
        new_weight = st.number_input("Current Weight (kg)", value=st.session_state.user_profile['weight'])
        if st.form_submit_button("Log Entry"):
            st.session_state.user_profile['weight'] = new_weight
            st.session_state.history.append({
                'date': datetime.date.today().isoformat(),
                'weight': new_weight,
                'tasks': len(st.session_state.daily_log['completed_tasks'])
            })
            st.success("Logged!")
            st.rerun()

# 6. SETTINGS
elif selected_tab == "Settings":
    st.header("⚙️ User Settings")
    
    with st.form("settings_form"):
        st.session_state.user_profile['name'] = st.text_input("Name", st.session_state.user_profile['name'])
        st.session_state.user_profile['diet'] = st.selectbox("Diet Type", ["Non-veg", "Veg"], index=0 if st.session_state.user_profile['diet']=="Non-veg" else 1)
        st.session_state.user_profile['mode'] = st.selectbox("Workout Mode", ["Home", "Gym"], index=0 if st.session_state.user_profile['mode']=="Home" else 1)
        
        if st.form_submit_button("Save Changes"):
            st.success("Settings updated!")
            st.rerun()
            
    if st.button("Reset All Data", type="primary"):
        st.session_state.clear()
        st.rerun()
