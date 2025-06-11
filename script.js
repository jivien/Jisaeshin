// Memilih elemen-elemen DOM yang akan digunakan
const generateBtn = document.getElementById('generate-btn');
const promptInput = document.getElementById('prompt-input');
const imageContainer = document.getElementById('image-container');
const placeholder = document.getElementById('placeholder');
const loader = document.getElementById('loader');
const resultImage = document.getElementById('result-image');
const errorMessage = document.getElementById('error-message');

// Menambahkan event listener ke tombol generate
generateBtn.addEventListener('click', async () => {
    const prompt = promptInput.value;

    // Validasi input
    if (!prompt) {
        errorMessage.textContent = 'Harap masukkan deskripsi sebelum menghasilkan gambar.';
        return;
    }

    // Menyiapkan UI untuk proses generasi
    errorMessage.textContent = '';
    generateBtn.disabled = true;
    generateBtn.querySelector('span').textContent = 'Menghasilkan...';
    placeholder.classList.add('hidden');
    resultImage.classList.add('hidden');
    loader.classList.remove('hidden');

    try {
        // Menyiapkan payload untuk API.
        // Kita menambahkan detail ke prompt untuk mendapatkan hasil berkualitas sinematik.
        const payload = {
            instances: [{
                prompt: `A cinematic, ultra-realistic 8k video still of: ${prompt}. Photorealistic, sharp focus, epic composition, high detail.`
            }],
            parameters: {
                "sampleCount": 1
            }
        };

        // API Key akan ditangani oleh lingkungan Canvas secara otomatis
        const apiKey = "AIzaSyBtpnpIOqPZTyJgWB6RrNYVL1bJKsWQN9Y"; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

        // Melakukan panggilan fetch ke API
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`Terjadi kesalahan jaringan: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        // Memeriksa dan menampilkan gambar
        if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
            const imageUrl = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
            resultImage.src = imageUrl;
            resultImage.classList.remove('hidden');
        } else {
            // Menampilkan pesan jika tidak ada gambar yang dikembalikan
            throw new Error('Gagal menghasilkan gambar. Coba prompt yang berbeda atau coba lagi nanti.');
        }

    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = error.message;
        // Jika terjadi kesalahan, tampilkan kembali placeholder
        placeholder.classList.remove('hidden');
    } finally {
        // Mengembalikan UI ke keadaan normal setelah proses selesai
        loader.classList.add('hidden');
        generateBtn.disabled = false;
        generateBtn.querySelector('span').textContent = 'Hasilkan Gambar';
    }
});
