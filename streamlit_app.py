import streamlit as st
from google import genai
from google.genai import types
import os

# Configure Page
st.set_page_config(
    page_title="GAURAV FIT COACH — Pro",
    page_icon="🏋️",
    layout="centered"
)

# Custom CSS to match the React App theme roughly
st.markdown("""
<style>
    .stChatInput { border-radius: 12px; }
    .stChatMessage { border-radius: 12px; padding: 1rem; }
    h1 { color: #4f46e5; }
</style>
""", unsafe_allow_html=True)

st.title("🏋️ Gaurav Fit Coach")
st.caption("AI-Powered Sports Medicine & Conditioning Coach")

# API Key Check
api_key = os.environ.get("API_KEY")
if not api_key:
    st.error("API_KEY environment variable not found. Please set it to use the app.")
    st.stop()

client = genai.Client(api_key=api_key)

# Sidebar Settings
with st.sidebar:
    st.header("⚙️ Coach Settings")
    mode = st.radio("Coaching Mode", ["Standard", "Expert (Thinking)"], index=0)
    
    st.markdown("---")
    st.markdown("**Mode Details:**")
    if mode == "Standard":
        st.info("⚡ **Standard**: Fast, conversational advice using `gemini-2.5-flash-lite`.")
    else:
        st.info("🧠 **Expert**: Deep reasoning and biomechanics analysis using `gemini-3-pro` with Thinking.")

    if st.button("Clear Chat History"):
        st.session_state.messages = []
        st.rerun()

# Initialize Chat History
if "messages" not in st.session_state:
    st.session_state.messages = [
        {"role": "model", "content": "Hello Gaurav! I am Dr. Fit. I see your bone mass is a priority. How is your back feeling today?"}
    ]

# Display Chat History
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# Handle User Input
if prompt := st.chat_input("Ask Dr. Fit..."):
    # Add User Message
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    # Generate Response
    with st.chat_message("model"):
        message_placeholder = st.empty()
        full_response = ""
        
        # System Instruction
        system_instruction = """
        You are Dr. Fit, an expert Sports Medicine Physician, Strength & Conditioning Coach, and Nutritionist.
        You are coaching Gaurav (24M, 60kg, 5'7", Goal: Bone Strength & Lean Muscle).
        
        YOUR PERSONA:
        - Professional, clinical, yet motivating.
        - Evidence-based advice only. No "bro-science".
        - Safety first. If a user mentions pain, suggest seeing a doctor.
        - Focus on his specific stats: Low bone mass (needs impact/loading), good protein rate, low BMR (needs metabolic boost).

        CORE KNOWLEDGE:
        - Bone Strength: Wolff's Law, axial loading, calcium/vitamin D, impact training.
        - Lookmaxing: Posture correction, skin health (hydration/sleep), stress management. No dangerous mewing.
        - Kegels: Pelvic floor strength for core stability and health.

        Be concise. Use bullet points for steps.
        """

        if mode == "Expert (Thinking)":
            system_instruction += "\n\n*** EXPERT MODE ***\nUse deep reasoning. Analyze biomechanics. Think before answering."
            model_id = "gemini-3-pro-preview"
            # Enable thinking budget for complex reasoning
            config = types.GenerateContentConfig(
                system_instruction=system_instruction,
                thinking_config=types.ThinkingConfig(include_thoughts=False, thinking_budget=32768)
            )
        else:
            # Use Flash Lite for low latency
            model_id = "gemini-2.5-flash-lite-latest"
            config = types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.7
            )

        # Prepare History for API
        chat_history = []
        for m in st.session_state.messages[:-1]: # Exclude current prompt which we send in 'message'
             chat_history.append(types.Content(role=m["role"], parts=[types.Part.from_text(text=m["content"])]))

        try:
            # Create Chat Session
            chat = client.chats.create(model=model_id, config=config, history=chat_history)
            
            # Stream Response
            response_stream = chat.send_message_stream(prompt)
            
            for chunk in response_stream:
                if chunk.text:
                    full_response += chunk.text
                    message_placeholder.markdown(full_response + "▌")
            
            message_placeholder.markdown(full_response)
            
            # Save Model Response
            st.session_state.messages.append({"role": "model", "content": full_response})

        except Exception as e:
            st.error(f"Error: {str(e)}")
