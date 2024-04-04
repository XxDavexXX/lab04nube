import { Router } from "express";
import pool from './../database/databse.js';

const router = Router();

router.get('/add', async (req, res) => {
    try {
        const [relaciones] = await pool.query('SELECT * FROM relacion');
        const [tiposCliente] = await pool.query('SELECT * FROM tipocliente');
        
        res.render('clientes/add', { relaciones, tiposCliente });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/add', async(req, res) => {
    try {
        const {nomcli, apecli, nrodnicli, telcli, idrelacion, idtipocliente} = req.body;
        const newCliente = {
            nomcli, apecli, nrodnicli, telcli, idrelacion, idtipocliente
        }
        await pool.query('INSERT INTO cliente SET ?', [newCliente]);
        res.redirect('/list');
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
});

router.get('/list', async(req, res) => {
    try{
        const [result] = await pool.query('SELECT cliente.*, TIPOCLIENTE.tipocliente AS tipo_cliente, RELACION.estado AS relacion FROM cliente INNER JOIN RELACION ON RELACION.id = cliente.idrelacion INNER JOIN TIPOCLIENTE ON TIPOCLIENTE.id = cliente.idtipocliente');

        res.render('clientes/list', {clientes: result});
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

router.get('/edit/:idcli', async(req, res) => {
    try {
        const { idcli } = req.params;
        const [cliente] = await pool.query('SELECT * FROM cliente WHERE idcli = ?', [idcli]);
        if (!cliente || cliente.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        const [relaciones] = await pool.query('SELECT * FROM relacion');
        const [tiposCliente] = await pool.query('SELECT * FROM tipocliente');
        res.render('clientes/edit', { cliente: cliente[0], relaciones, tiposCliente });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/edit/:idcli', async (req, res) => {
    try {
        const { nomcli, apecli, nrodnicli, telcli, idrelacion, idtipocliente } = req.body;
        const { idcli } = req.params;
        const editCliente = { nomcli, apecli, nrodnicli, telcli, idrelacion, idtipocliente };
        await pool.query('UPDATE cliente SET ? WHERE idcli = ?', [editCliente, idcli]);
        res.redirect('/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



router.get('/delete/:idcli', async(req, res) => {
    try {
        const {idcli} = req.params;
        await pool.query('DELETE FROM cliente WHERE idcli = ?', [idcli]);
        res.redirect('/list');
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

export default router;