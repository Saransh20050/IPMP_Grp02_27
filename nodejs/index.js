const express=require('express');
const app=express();
const PORT=3000;
app.use(express.json());
app.post('/sum',(req, res)=>{
    const {num1,num2}=req.body;
    if(typeof num1 !== 'number' ||typeof num2 !== 'number') {
        return res.status(400).json({error: 'Inputs must be numbers'});
    }

    const sum =num1+num2;
    res.json({ sum });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
