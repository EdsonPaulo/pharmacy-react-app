/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import {
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Textarea,
  SimpleGrid,
  Image,
  Center,
  Box,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { BiImageAdd } from 'react-icons/bi';
import {
  getProductCategories,
  postCreateProduct,
  postUploadImage,
} from '../../services/products';
import { useFormik } from 'formik';
import { newProductSchema } from './products.helpers';
import { IProduct } from '../../typescript/types';
import { formatMoney } from '../../helpers/numberFormat';

interface ProductsFormProps {
  mode: 'edit' | 'view';
  selectedProduct?: IProduct;
  onClose: () => void;
  onRefetch: () => void;
}

export const ProductsForm = ({
  selectedProduct,
  mode,
  onClose,
  onRefetch,
}: ProductsFormProps) => {
  const toast = useToast();
  const { data: productCategories = [], isLoading: isLoadingCategories } =
    useQuery('product-categories', getProductCategories);

  const { isLoading, mutate: mutateAddProduct } = useMutation(
    'create-product',
    postCreateProduct,
  );
  const { isLoading: isUploading, mutateAsync: mutateUploadImage } =
    useMutation('upload-product-image', postUploadImage);
  const [images, setImages] = useState<ImageListType>(
    selectedProduct?.image ? [{ dataURL: selectedProduct?.image }] : [],
  );

  const isViewMode = useMemo(() => mode === 'view', [mode]);

  const onChange = (imageList: ImageListType) => {
    setImages(imageList);
  };

  const {
    handleSubmit,
    isValid,
    errors,
    touched,
    handleChange,
    resetForm,
    values,
  } = useFormik({
    validationSchema: newProductSchema,
    enableReinitialize: true,
    validateOnMount: true,
    validateOnChange: true,
    initialValues: {
      name: selectedProduct?.name ?? '',
      price: selectedProduct?.price ?? '',
      stock: selectedProduct?.stock ?? '',
      description: selectedProduct?.description ?? '',
      manufacture_date: selectedProduct?.manufactureDate ?? '',
      expiration_date: selectedProduct?.expirationDate ?? '',
      fk_product_category: selectedProduct?.fkProductCategory ?? '',
    },
    onSubmit: async (values) => {
      let uploadedImageUrl = '';
      try {
        if (images[0]?.file) {
          await mutateUploadImage(
            {
              file: images[0]?.file,
              dataUrl: images[0]?.dataUrl,
            },
            {
              onSuccess: (res) => {
                uploadedImageUrl = res.url;
                console.log('UPLOAD FEITO COM SUCCESSO', res);
              },
              onError: (e: any) => {
                console.log('ERROR UPLOADING IMAGE', e, e?.response?.data);
              },
            },
          );
        }
      } catch (error) {}

      mutateAddProduct({ ...values, image: uploadedImageUrl || null } as any, {
        onSuccess: async () => {
          resetForm();
          toast({
            duration: 2000,
            position: 'top-right',
            variant: 'subtle',
            status: 'success',
            title: 'Produto criado com sucesso!',
          });
          onRefetch();
          onClose();
        },
        onError: (e: any) => {
          toast({
            duration: 3000,
            position: 'top-right',
            variant: 'subtle',
            status: 'error',
            title:
              e?.response?.data?.message ??
              'Ocorreu um erro ao criar utilizador',
          });
        },
      });
    },
  });

  const isAddButtonDisabled = useMemo(
    () => isLoading || isUploading || !isValid || isViewMode,
    [isLoading, isUploading, isValid, isViewMode],
  );

  return (
    <form onSubmit={handleSubmit}>
      <ModalContent>
        <ModalHeader>{selectedProduct ? 'Editar' : 'Novo'} Produto</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Box mb={4}>
            <FormLabel>Imagem do Produto</FormLabel>
            {isViewMode ? (
              <Center>
                <Image
                  src={selectedProduct?.image || '/default-image.png'}
                  width="180px"
                  height="180px"
                />
              </Center>
            ) : (
              <Box>
                <ImageUploading
                  multiple={false}
                  value={images}
                  onChange={onChange}
                  maxNumber={1}
                >
                  {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps,
                  }) => (
                    // write your building UI
                    <Box className="upload__image-wrapper">
                      {imageList.length === 0 ? (
                        <Center
                          onClick={onImageUpload}
                          cursor="pointer"
                          color="gray.600"
                          textAlign="center"
                          flexDir="column"
                        >
                          <BiImageAdd size={100} />

                          <Button
                            variant="ghost"
                            style={
                              isDragging
                                ? { color: 'brand.primary' }
                                : undefined
                            }
                            onClick={onImageUpload}
                            fontWeight="normal"
                            {...dragProps}
                          >
                            Clique ou Arraste uma imagem aqui
                          </Button>
                        </Center>
                      ) : (
                        <Center>
                          {imageList.map((image, index) => (
                            <Center
                              key={index}
                              className="image-item"
                              textAlign="center"
                              flexDir="column"
                            >
                              <Image
                                src={image.dataURL}
                                width="170px"
                                height="170px"
                              />
                              <Center mt={2}>
                                <Button
                                  mr={2}
                                  variant="ghost"
                                  onClick={() => onImageUpdate(index)}
                                >
                                  Alterar
                                </Button>
                                <Button
                                  variant="ghost"
                                  onClick={() => onImageRemove(index)}
                                >
                                  Remover
                                </Button>
                              </Center>
                            </Center>
                          ))}
                        </Center>
                      )}
                    </Box>
                  )}
                </ImageUploading>
              </Box>
            )}
          </Box>

          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing="10px"
            my={'15px'}
          >
            <FormControl
              isInvalid={!isViewMode && !!errors?.name && !!touched.name}
              isRequired={!isViewMode}
            >
              <FormLabel>Nome do Produto</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">{selectedProduct?.name || '-'}</Text>
              ) : (
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={values.name}
                  disabled={isViewMode}
                  placeholder="ex.: Amoxiciclina"
                  onChange={handleChange}
                />
              )}
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl
              isRequired={!isViewMode}
              isInvalid={!isViewMode && !!errors.price && !!touched.price}
            >
              <FormLabel>Preço</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">
                  {formatMoney(selectedProduct?.price ?? 0)}
                </Text>
              ) : (
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={values.price}
                  disabled={isViewMode}
                  placeholder="0.00"
                  onChange={handleChange}
                />
              )}
              <FormErrorMessage>{errors.price}</FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={!isViewMode && !!errors.stock && !!touched.stock}
            >
              <FormLabel>Stock</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">{selectedProduct?.stock || '-'}</Text>
              ) : (
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={values.stock}
                  disabled={isViewMode}
                  placeholder="0"
                  onChange={handleChange}
                />
              )}
              <FormErrorMessage>{errors.stock}</FormErrorMessage>
            </FormControl>

            <FormControl
              // isRequired={!isViewMode}
              isInvalid={
                !isViewMode &&
                !!errors?.fk_product_category &&
                !!touched.fk_product_category
              }
            >
              <FormLabel>Categoria</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">
                  {selectedProduct?.productCategory?.name || '-'}
                </Text>
              ) : (
                <Select
                  id="fk_product_category"
                  name="fk_product_category"
                  disabled={isViewMode}
                  value={values.fk_product_category}
                  placeholder="Selecione uma opção"
                  onChange={handleChange}
                  isDisabled={isLoadingCategories}
                >
                  {productCategories.map((pc) => (
                    <option
                      key={pc.pkProductCategory}
                      value={pc.pkProductCategory}
                    >
                      {pc.name}
                    </option>
                  ))}
                </Select>
              )}
              <FormErrorMessage>{errors.fk_product_category}</FormErrorMessage>
            </FormControl>

            <FormControl
              isRequired={!isViewMode}
              isInvalid={
                !isViewMode &&
                !!errors.manufacture_date &&
                !!touched.manufacture_date
              }
            >
              <FormLabel>Data de fabricação</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">
                  {selectedProduct?.manufactureDate
                    ? new Date(
                        selectedProduct?.manufactureDate,
                      ).toLocaleDateString('pt-PT')
                    : '-'}
                </Text>
              ) : (
                <Input
                  id="manufacture_date"
                  name="manufacture_date"
                  type="date"
                  value={values.manufacture_date}
                  placeholder={'dd/mm/aaaa'}
                  onChange={handleChange}
                />
              )}
              <FormErrorMessage>{errors.manufacture_date}</FormErrorMessage>
            </FormControl>

            <FormControl
              isRequired={!isViewMode}
              isInvalid={
                !isViewMode &&
                !!errors.expiration_date &&
                !!touched.expiration_date
              }
            >
              <FormLabel>Data de expiração</FormLabel>
              {isViewMode ? (
                <Text fontWeight="900">
                  {selectedProduct?.expirationDate
                    ? new Date(
                        selectedProduct?.expirationDate,
                      ).toLocaleDateString('pt-PT')
                    : '-'}
                </Text>
              ) : (
                <Input
                  id="expiration_date"
                  name="expiration_date"
                  type="date"
                  value={values.expiration_date}
                  placeholder={'dd/mm/aaaa'}
                  onChange={handleChange}
                />
              )}
              <FormErrorMessage>{errors.expiration_date}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <FormControl
            isInvalid={
              !isViewMode && !!errors?.description && !!touched.description
            }
          >
            <FormLabel>Descrição</FormLabel>
            {isViewMode ? (
              <Text fontWeight="900">
                {selectedProduct?.description || '-'}
              </Text>
            ) : (
              <Textarea
                id="description"
                name="description"
                value={values.description}
                placeholder={'Descrição do produto'}
                onChange={handleChange}
              />
            )}
            <FormErrorMessage>{errors.description}</FormErrorMessage>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button mr={4} variant="ghost" onClick={onClose}>
            Fechar
          </Button>

          {!isViewMode && (
            <Button
              colorScheme="teal"
              background="brand.primary"
              isLoading={isLoading || isUploading}
              disabled={isAddButtonDisabled}
              type="submit"
            >
              Submeter
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </form>
  );
};
