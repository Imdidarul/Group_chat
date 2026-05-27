# **Group Chat**



**A real-time, feature-rich chat application that supports global broadcasting, private/group rooms, user authentication, and AI-powered smart replies. Built with a Node.js/Express backend, vanilla HTML/CSS frontend, and powered by Socket.io and Hugging Face AI.**





### **Features**

### 

#### **Real-Time Messaging \& Rooms**



* **Global Chat:** A default public room where every connected user can send and receive messages instantly.
* **Custom Group Rooms:** Users can create and join specific rooms for private group conversations.
* **Typing Indicators:** Real-time visual feedback showing when another user is actively typing.
* 

#### **AI-Powered Smart Utilities**

* **Suggested Replies:** Leverages open-source models from Hugging Face to analyze incoming messages and suggest quick, context-aware responses.
* **Auto-Completion:** Provides real-time text completion suggestions to help users type messages faster.



#### **Media \& File Sharing**

* **Secure file, document, and image uploads handled seamlessly via AWS S3 bucket storage.**



#### **Secure Authentication**

* **Flexible Login:** Users can sign up and log in using either their **Email** or **Phone Number**.
* **Data Security:** Passwords are securely hashed and encrypted using `bcrypt` before being stored.





### **Tech Stack**



##### **Frontend**

* HTML5 \& CSS3: Clean, responsive layout.
* Socket.io Client: Real-time event handling.



##### **Backend**

* Node.js \& Express.js: Server-side architecture and RESTful APIs.
* Socket.io: WebSockets for low-latency, bi-directional communication.
* Bcrypt: Password hashing and verification.



##### **Cloud \& AI Services**

* AWS S3: Cloud object storage for hosting shared files and images.
* Hugging Face Inference API: Powering the NLP models for smart autocomplete and suggestions.







#### **Installation \& Setup**



Follow these steps to get the project running locally on your machine.



#### **Prerequisites**

* [Node.js](https://nodejs.org/) installed (v16+ recommended).
* A Hugging Face account and API token (for the AI features).



###### **1. Clone the Repository**


git clone https://github.com/Imdidarul/Group_chat.git
cd groupChat



###### **2. Install Dependencies**

npm install



###### **3. Environment Variables**

Create a .env file in the root directory and populate it with your credentials:



PORT = 3000



DB\_HOST = "your\_DB\_Host\_Name"

DB\_NAME = "your\_DB\_Name"

DB\_USER = "your\_username"

DB\_PASSWORD = "your\_db\_pass"



HUGGINGFACE\_API\_KEY = your\_hugging\_face\_api\_token



AWS\_ACCESS\_KEY\_ID=your\_aws\_access\_key

AWS\_SECRET\_ACCESS\_KEY=your\_aws\_secret\_key

AWS\_REGION=your\_aws\_region

AWS\_BUCKET\_NAME=your\_s3\_bucket\_name





**4. Run the Application**

npm start



Open your frontend entry point (index.html) in your browser to interact with the application.



