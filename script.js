// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // DOM element references
    const imageUpload = document.getElementById('image-upload');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const promptInput = document.getElementById('prompt-input');
    const generateBtn = document.getElementById('generate-btn');
    const resultContainer = document.getElementById('result-container');
    const placeholder = document.getElementById('placeholder');
    const loader = document.getElementById('loader');
    const resultImage = document.getElementById('result-image');
    const messageBox = document.getElementById('message-box');

    let uploadedImageBase64 = null;

    // Event listener for file upload
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageUrl = event.target.result;
                imagePreview.src = imageUrl;
                imagePreviewContainer.classList.remove('hidden');
                // Store the base64 string without the data URL prefix
                uploadedImageBase64 = imageUrl.split(',')[1];
                generateBtn.disabled = false;
                messageBox.textContent = '';
            };
            reader.readAsDataURL(file);
        }
    });

    // Event listener for generate button click
    generateBtn.addEventListener('click', async () => {
        if (!uploadedImageBase64) {
            showMessage("Silakan unggah gambar terlebih dahulu.");
            return;
        }

        // --- Start loading state ---
        setLoadingState(true);
        let finalPrompt = "";

        try {
            // --- Step 1: Analyze the image with Gemini to get a description ---
            showMessage("Menganalisis gambar...");
            const geminiPrompt = "Describe this image for a text-to-image AI. Be descriptive and focus on the main subject, setting, and style.";
            
            const geminiPayload = {
                contents: [{
                    role: "user",
                    parts: [
                        { text: geminiPrompt },
                        { inlineData: { mimeType: "image/png", data: uploadedImageBase64 } }
                    ]
                }],
            };

            const geminiApiKey = ""; // API key is handled by the environment
            const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

            const geminiResponse = await fetch(geminiApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(geminiPayload)
            });

            if (!geminiResponse.ok) {
                throw new Error(`Gemini API error! Status: ${geminiResponse.status}`);
            }

            const geminiResult = await geminiResponse.json();
            
            let imageDescription = "A detailed image"; // Fallback description
            if (geminiResult.candidates && geminiResult.candidates[0]?.content?.parts[0]?.text) {
                imageDescription = geminiResult.candidates[0].content.parts[0].text;
            } else {
                 console.warn("Could not get a detailed description from Gemini, using fallback.");
            }

            // --- Step 2: Combine description with user prompt ---
            const userPrompt = promptInput.value.trim();
            finalPrompt = userPrompt ? `${imageDescription}, ${userPrompt}` : imageDescription;
            showMessage("Membuat gambar AI baru...");
            console.log("Final prompt for Imagen:", finalPrompt);


            // --- Step 3: Generate the new image with Imagen ---
            const imagenPayload = {
                instances: [{ prompt: finalPrompt }],
                parameters: { "sampleCount": 1 }
            };
            const imagenApiKey = ""; // API key is handled by the environment
            const imagenApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${imagenApiKey}`;

            const imagenResponse = await fetch(imagenApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(imagenPayload)
            });
            
            if (!imagenResponse.ok) {
                throw new Error(`Imagen API error! Status: ${imagenResponse.status}`);
            }

            const imagenResult = await imagenResponse.json();
            if (imagenResult.predictions && imagenResult.predictions[0]?.bytesBase64Encoded) {
                const newImageData = imagenResult.predictions[0].bytesBase64Encoded;
                resultImage.src = `data:image/png;base64,${newImageData}`;
                resultImage.classList.remove('hidden');
                resultImage.classList.add('fade-in');
            } else {
                throw new Error("Gagal membuat gambar. Respon API tidak valid.");
            }

        } catch (error) {
            console.error("Error:", error);
            showMessage(`Terjadi kesalahan: ${error.message}`);
            resultImage.classList.add('hidden'); // Hide potentially broken image link
        } finally {
            // --- End loading state ---
            setLoadingState(false);
        }
    });

    // Helper function to manage UI loading state
    function setLoadingState(isLoading) {
        if (isLoading) {
            generateBtn.disabled = true;
            placeholder.classList.add('hidden');
            resultImage.classList.add('hidden');
            loader.classList.remove('hidden');
        } else {
            generateBtn.disabled = false;
            loader.classList.add('hidden');
            if (!resultImage.src || resultImage.src === window.location.href + '#') {
                 placeholder.classList.remove('hidden');
            }
        }
    }
    
    // Helper function to display messages to the user
    function showMessage(msg) {
        messageBox.textContent = msg;
    }
});
