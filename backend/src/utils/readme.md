 const IsAllowed = mandatoryField.every((k)=> Object.keys(data).includes(k));


Object.keys(data) checks every key of req.body to ensure it contains all mandatory fields