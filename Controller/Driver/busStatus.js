const { Bus } = require('../../Model/Bus');

const busStatusUpdate= async (req, res) => {
  try {
    const { busId } = req.body;
    const { delay, delayReason, arrivedLastStop, arrivedNextStop, seatsAvailable } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ error: 'Autobús no encontrado' });
    }

    if (delay !== undefined) {
      if (typeof delay !== 'string') {
        return res.status(400).json({ error: 'El retraso debe ser una cadena de caracteres' });
      }
      bus.delay = delay;
    }

    if (delayReason !== undefined) {
      if (typeof delayReason !== 'string') {
        return res.status(400).json({ error: 'La razón del retraso debe ser una cadena de caracteres' });
      }
      bus.delayReason = delayReason;
    }

    if (arrivedLastStop !== undefined) {
      if (typeof arrivedLastStop !== 'string') {
        return res.status(400).json({ error: 'La llegada a la última parada debe ser una cadena de caracteres' });
      }
      bus.arrivedLastStop = arrivedLastStop;
    }

    if (arrivedNextStop !== undefined) {
      if (typeof arrivedNextStop !== 'string') {
        return res.status(400).json({ error: 'La llegada a la siguiente parada debe ser una cadena de caracteres' });
      }
      bus.arrivedNextStop = arrivedNextStop;
    }

    if (seatsAvailable !== undefined) {
      if (typeof seatsAvailable !== 'number') {
        return res.status(400).json({ error: 'Los asientos disponibles deben ser un número' });
      }
      bus.seatsAvailable = seatsAvailable;
    }

    await bus.save();

    res.json({ message: 'Estado del autobús actualizado con éxito' });
  } catch (error) {
    console.error('Error updating bus status:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {busStatusUpdate};
